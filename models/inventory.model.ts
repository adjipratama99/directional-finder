import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';
import { sequelize } from '@/db/connect';
import { SatuanKerja } from './SatuanKerja.model';

export class Inventory extends Model<
    InferAttributes<Inventory>,
    InferCreationAttributes<Inventory>
> {
    declare id: number;
    declare nama: string;
    declare tahun_pengadaan: string;
    declare tipe_df: string;
    declare satuan_kerja: string;
    declare wilayah: string;
    declare kondisi_perangkat: string;
    declare teknologi: string;
    declare status: number;
    declare keterangan: string;
    declare userCreate: string;
    declare dateCreate: CreationOptional<Date>;
    declare dateUpdate: Date | null;
}

Inventory.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        nama: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
        },
        tahun_pengadaan: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
        },
        tipe_df: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
        },
        teknologi: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: false,
            defaultValue: '',
        },
        satuan_kerja: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
        },
        wilayah: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
        },
        kondisi_perangkat: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
        },
        status: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 1,
        },
        keterangan: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
        },
        userCreate: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
        },
        dateCreate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        dateUpdate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
    },
    {
        sequelize,
        tableName: 'inventory',
        modelName: 'Inventory',
        timestamps: false,
    }
);

Inventory.belongsTo(SatuanKerja, {
    foreignKey: "wilayah",
    targetKey: "wilayah",
    as: "satuan_kerja_data"
});