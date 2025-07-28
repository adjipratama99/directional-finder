// db/repository.ts
import { sequelize } from './connect';
import { DirectionalFinder } from '@/models/directionalFinder.model';
import { UploadedFile } from '@/models/uploadedFiles.model';
import { SatuanKerja } from '@/models/SatuanKerja.model';
import { User } from '@/models/user.model';

const modelsMap = {
    DirectionalFinder,
    UploadedFile,
    SatuanKerja,
    User,
} as const;

type ModelName = keyof typeof modelsMap;

export const getTableByModelName = async (modelName: string) => {
    const model = modelsMap[modelName as ModelName];

    if (!model) {
        throw new Error(`Invalid model name: ${modelName}`);
    }

    return { db: sequelize, model };
};
