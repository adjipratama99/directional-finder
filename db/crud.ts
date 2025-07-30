import { Model, ModelStatic } from 'sequelize';
import { formatInTimeZone } from 'date-fns-tz';

export const handleCreate = async (
    model: ModelStatic<Model<any, any>>,
    body: any
) => {
    try {
        const newData = {
            ...body,
            status: 1,
            dateCreate: formatInTimeZone(new Date(), 'UTC', 'yyyy-MM-dd HH:mm:ss'),
            dateUpdate: null,
        };

        const result = await model.create(newData);
        return !!result;
    } catch (err) {
        console.error('Create error:', err);
        return false;
    }
};

export const handleUpdate = async (
    model: ModelStatic<Model<any, any>>,
    body: any
) => {
    try {
        const [affectedRows] = await model.update(
            {
                ...body,
                dateUpdate: formatInTimeZone(new Date(), 'UTC', 'yyyy-MM-dd HH:mm:ss'),
            },
            {
                where: { id: body.id }
            }
        );

        return affectedRows > 0;
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
