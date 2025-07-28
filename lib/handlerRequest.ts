import { connectDB } from "@/lib/db"
import { Brackets, DataSource } from "typeorm"
import { formatInTimeZone } from "date-fns-tz"

export type RequestType = "create" | "update" | "delete" | "get" | "read"
type ConfigType = {
    body: Record<string, any>,
    type: RequestType,
    modelName: string,
    findByKey?: string,
    desiredKey?: string[],
    searchKey?: string[]
}

export const handlerRequest = async (config: ConfigType) => {
    const { body, type, modelName, findByKey, desiredKey, searchKey } = config
    const db = await connectDB()

    const repo = await getRepositoryByModelName(db, modelName)

    switch (type) {
        case "create":
            try {
                const lastItem = await repo.findOne({
                    where: {},
                    order: { id: "DESC" },
                })
                const newId = (lastItem?.id || 0) + 1
    
                const created = repo.create({
                    id: newId,
                    ...body, 
                    status: 1,
                    dateCreate: formatInTimeZone(new Date(), 'UTC', 'yyyy-MM-dd HH:mm:ss'),
                    dateUpdate: null
                })

                const saved = await repo.save(created);

                return saved?.id ? true : false
            } catch (err) {
                console.error("💥 Error in create:", err)
                console.error(err)
            }
            break;
        case "update":
            if (!body.id) return "Missing `id` in body for update"
            await repo.update(body.id, {...body, dateUpdate: formatInTimeZone(new Date(), 'UTC', 'yyyy-MM-dd HH:mm:ss'),})
            const response = await repo.findOneBy({ id: body.id })
            return response?.id ? true : false

        case "delete":
            if (!body.id) return "Missing `id` in body for delete"
            await repo.delete(body.id)
            return { message: "Deleted successfully" }

        case "get": {
            const {
                filters = {},
                sort = {},
                offset,
                limit,
                isFile = false,
                isUnique = false,
            } = body;
        
            const search = typeof filters.search === "string" ? filters.search.trim() : "";
        
            const qb = repo.createQueryBuilder("model");
        
            // Special case: SatuanKerja with unique wilayah
            const isSatuanKerja = modelName === "SatuanKerja";
            const needsUniqueWilayah = isUnique && isSatuanKerja;

            if (!needsUniqueWilayah && (typeof offset !== "number" || typeof limit !== "number")) {
                throw new Error("Both 'offset' and 'limit' must be numbers and are required.");
            }
        
            if (isSatuanKerja && needsUniqueWilayah) {
                qb.select("DISTINCT model.wilayah", "wilayah");
            } else {
                qb.select("model");
        
                // Join relation kalau model DirectionalFinder
                if (modelName === "DirectionalFinder") {
                    qb.leftJoinAndSelect("model.uploaded_files", "uploaded_files");
                }
            }
        
            // Handle global search (multi field)
            if (search && !needsUniqueWilayah) {
                const searchFields = searchKey && searchKey.length ? searchKey : desiredKey;
                if (Array.isArray(searchFields) && searchFields.length > 0) {
                    qb.andWhere(
                        new Brackets((qbInner) => {
                            for (const field of searchFields) {
                                if (field.includes("uploaded_files.")) {
                                    qbInner.orWhere(`uploaded_files.${field.split(".")[1]} LIKE :search`, {
                                        search: `%${search}%`,
                                    });
                                } else {
                                    qbInner.orWhere(`model.${field} LIKE :search`, {
                                        search: `%${search}%`,
                                    });
                                }
                            }
                        })
                    );
                }
            }
        
            // Handle filter spesifik (non search)
            for (const key in filters) {
                if (key === "search") continue;
        
                const value = filters[key];
                const column = key.includes("uploaded_files.") ? key : `model.${key}`;
        
                if (key === "status" && filters[key]) {
                    qb.andWhere(
                        Array.isArray(value)
                            ? `${column} IN (:...${key})`
                            : `${column} = :${key}`,
                        { [key]: value }
                    );
                } else if (typeof value === "string") {
                    qb.andWhere(`${column} LIKE :${key}`, { [key]: `%${value}%` });
                } else {
                    qb.andWhere(`${column} = :${key}`, { [key]: value });
                }
            }
        
            // Sorting
            if (Object.keys(sort).length && !needsUniqueWilayah) {
                for (const key in sort) {
                    const direction = sort[key] === -1 ? "DESC" : "ASC";
                    qb.addOrderBy(`model.${key}`, direction);
                }
            }
        
            // Pagination
            if (!needsUniqueWilayah) {
                qb.skip(offset).take(limit);
            }
        
            const [resultsRaw, count] = await qb.getManyAndCount();
            let results = resultsRaw;
        
            // Extra enrichment: uploaded_files
            if (isFile && modelName === "DirectionalFinder") {
                const uploadedRepo = await getRepositoryByModelName(db, "UploadedFile");
                const enrichedResults = await Promise.all(
                    resultsRaw.map(async (df) => {
                        const files = await uploadedRepo.find({
                            where: { directional_finder: { id: df.id } },
                        });
                        return { ...df, uploaded_files: files };
                    })
                );
                results = enrichedResults;
            }
        
            // Kalau mau filter field output pakai desiredKey
            if (Array.isArray(desiredKey) && desiredKey.length && !needsUniqueWilayah) {
                results = results.map((item) => {
                    const filtered: Record<string, any> = {};
                    for (const key of desiredKey) {
                        if (key in item) filtered[key] = item[key];
                    }
                    return filtered;
                });
            }
        
            // Kalo isUnique = true untuk wilayah, map hasil biar jadi array of string
            if (needsUniqueWilayah) {
                results = results.map((row: any) => row.wilayah).filter(Boolean);
            }
        
            return { count, results };
        }                      
        case "read":
            if (!findByKey) return "Missing `findByKey` in argument for read"
            return await repo.findOneBy({ [findByKey]: body[findByKey] })

        default:
            return `Unknown request type: ${type}`
    }
}

const getRepositoryByModelName = async (db: DataSource, modelName: string) => {
    try {
        const module = await import(`@/entities/${modelName}`)
        const model = module[modelName]
        if (!model) throw new Error(`Model ${modelName} not found in module`)
        return db.getRepository(model)
    } catch (err) {
        console.error(`[handlerRequest] Failed to load model "${modelName}"`, err)
        throw new Error(`Invalid model name: ${modelName}`)
    }
}

export const requiredKey = async (keys: string[], body: Record<string, any>): Promise<boolean> => {
    return keys.every((key) => body.hasOwnProperty(key) && body[key] !== undefined && body[key] !== null)
}
