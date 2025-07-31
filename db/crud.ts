import { Model, ModelStatic } from 'sequelize';
import { formatInTimeZone } from 'date-fns-tz';
import { ConfigType } from './handler';
import { UploadedFile } from '@/models/uploadedFiles.model';

export const handleCreate = async (
    model: ModelStatic<Model<any, any>>,
    body: any,
    config: ConfigType
) => {
    try {
        const newData = {
            ...body,
        };

        const result = await model.create(newData, {
            returning: true
        });

        if (body.uploaded_files?.length) {
            const files = body.uploaded_files.map((file: any) => ({
                ...file,
                directionalFinderId: result.id,
            }));
            await UploadedFile.bulkCreate(files);
        }

        return !!result;
    } catch (err) {
        console.error('Create error:', err);
        return false;
    }
};

export const handleUpdate = async (
    model: ModelStatic<Model<any, any>>,
    body: any,
    config: ConfigType,
) => {
    try {
        const [affectedRows, updatedRows] = await model.update(
            {
                ...body,
                dateUpdate: formatInTimeZone(new Date(), 'UTC', 'yyyy-MM-dd HH:mm:ss'),
            },
            {
                where: { [config?.findByKey ?? "id"]: body[config?.findByKey ?? "id"] },
                returning: config.includeData ?? false
            }
        ) as [number, any[]?];

        return config.includeData ? { affectedRows, updatedRows } : affectedRows > 0;
    } catch (err) {
        console.error('Update error:', err);
        return false;
    }
};

export const handleDelete = async (
    model: ModelStatic<Model<any, any>>,
    body: any
) => {
    if (!body.id) return 'Missing `id` in body for delete';

    try {
        await model.destroy({ where: { id: body.id } });
        return { message: 'Deleted successfully' };
    } catch (err) {
        console.error('Delete error:', err);
        return { message: 'Delete failed' };
    }
};
