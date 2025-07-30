import { handleCreate, handleDelete, handleUpdate } from "./crud";
import { buildQuery } from "./queryBuilder";
import { getTableByModelName } from "./repository";
import { Model, ModelStatic } from "sequelize";

export type RequestType = "create" | "update" | "delete" | "get" | "read";

export type ConfigType = {
    body: Record<string, any>;
    type: RequestType;
    modelName: string;
    findByKey?: string;
    desiredKey?: string[];
    searchKey?: string[];
    includeData?: boolean;
};

type HandlerFunction = (
    model: ModelStatic<Model<any, any>>,
    body: Record<string, any>,
    config?: ConfigType
) => Promise<any>;

const handlers: Record<RequestType, HandlerFunction> = {
    create: (model, body) => handleCreate(model, body),
    update: (model, body, config) => handleUpdate(model, body, config!),
    delete: (model, body) => handleDelete(model, body),
    get: (model, body, config) =>
        buildQuery({
            model,
            body,
            modelName: config?.modelName ?? "",
            desiredKey: config?.desiredKey,
            searchKey: config?.searchKey,
        }),
    read: async (model, body, config) => {
        const findByKey = config?.findByKey ? config?.findByKey : "id";
        if (!findByKey) throw new Error("Missing `findByKey` in argument for read");

        return model.findOne({
            where: { [findByKey]: body[findByKey] },
        });
    },
};

export const handlerRequest = async (config: ConfigType) => {
    const { modelName, type, body } = config;
    const { model } = await getTableByModelName(modelName); // ambil langsung table-nya
    const handler = handlers[type];

    if (!handler) throw new Error(`Unknown request type: ${type}`);

    return handler(model, body, config);
};
