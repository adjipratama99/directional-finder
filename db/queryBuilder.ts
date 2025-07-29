import { Op, Sequelize, Model, FindOptions, IncludeOptions, ModelStatic } from "sequelize";

type BuildQueryParams = {
  model: ModelStatic<Model<any, any>>; // ganti dari typeof Model
  body: Record<string, any>;
  modelName: string;
  desiredKey?: string[];
  searchKey?: string[];
};

export const buildQuery = async ({
  model,
  body,
  modelName,
  desiredKey,
  searchKey,
}: BuildQueryParams) => {
  const {
    filters = {},
    sort = {},
    offset,
    limit,
    isFile = false,
    isUnique = false,
  } = body;

  const search = typeof filters.search === "string" ? filters.search.trim() : "";

  const isSatuanKerja = modelName === "SatuanKerja";
  const isUser = modelName === "User";
  const needsUniqueWilayah = isUnique && isSatuanKerja;

  if (!needsUniqueWilayah && (typeof offset !== "number" || typeof limit !== "number")) {
    throw new Error("offset dan limit wajib number");
  }

  const where: any = {};
  const include: IncludeOptions[] = [];

  // Handle search
  if (search && !needsUniqueWilayah) {
    const fields = searchKey?.length ? searchKey : desiredKey;
    if (fields && fields.length) {
      where[Op.or] = fields.map((field) => {
        const isRelation = field.includes(".");
        if (isRelation) {
          const [relation, relField] = field.split(".");
          include.push({
            association: relation as any,
            where: { [relField]: { [Op.iLike]: `%${search}%` } },
            required: false,
          });
          return;
        }

        return { [field]: { [Op.iLike]: `%${search}%` } };
      }).filter(Boolean);
    }
  }

  // Handle filters
  for (const key in filters) {
    if (key === "search") continue;
    const value = filters[key];

    if (key === "status" && value) {
      where[key] = Array.isArray(value) ? { [Op.in]: value } : value;
    } else if (typeof value === "string") {
      where[key] = { [Op.iLike]: `%${value}%` };
    } else {
      where[key] = value;
    }
  }

  if (isUser) {
    where['role'] = { [Op.ne]: 'admin' };
  }

  // Handle sorting
  const order: [string, string][] = [];
  for (const key in sort) {
    if (!needsUniqueWilayah) {
      order.push([key, sort[key] === -1 ? "DESC" : "ASC"]);
    }
  }

  // Build final query
  const findOptions: FindOptions = {
    where,
    include,
    order,
  };

  if (!needsUniqueWilayah) {
    findOptions.offset = offset;
    findOptions.limit = limit;
  }

  // Special SELECT DISTINCT wilayah
  if (needsUniqueWilayah) {
    const wilayahs = await model.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("wilayah")), "wilayah"]
      ],
      raw: true,
    });

    const results = wilayahs.map((row: any) => row.wilayah).filter(Boolean);
    return { count: results.length, results };
  }

  const { rows: resultsRaw, count } = await model.findAndCountAll(findOptions);
  let results = resultsRaw.map(r => r.toJSON());

  // File join (DirectionalFinder ← UploadedFiles)
  if (isFile && modelName === "DirectionalFinder") {
        const uploadedModelModule = await import('@/models/uploadedFiles.model');
        const UploadedFile = uploadedModelModule.UploadedFile;

        const withFiles = await Promise.all(results.map(async (df: any) => {
            const files = await UploadedFile.findAll({
                where: { directionalFinderId: df.id },
                raw: true,
            });
            return { ...df, uploaded_files: files };
        }));

        results = withFiles;
    }



  // Desired keys filtering
  if (Array.isArray(desiredKey) && desiredKey.length && !needsUniqueWilayah) {
    results = results.map(item => {
      const filtered: Record<string, any> = {};
      for (const key of desiredKey) {
        if (key in item) filtered[key] = item[key];
      }
      return filtered;
    });
  }

  return { count, results };
};
