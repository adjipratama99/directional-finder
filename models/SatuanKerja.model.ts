import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';
import { sequelize } from '@/db/connect';

export class SatuanKerja extends Model<
    InferAttributes<SatuanKerja>,
    InferCreationAttributes<SatuanKerja>
> {
    declare id: CreationOptional<number>;
    declare wilayah: string | null;
    declare satuan_wilayah: string | null;
    declare nama_satuan: string | null;
}

SatuanKerja.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        wilayah: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        satuan_wilayah: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        nama_satuan: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'satuan_kerja',
        timestamps: false,
    }
);
