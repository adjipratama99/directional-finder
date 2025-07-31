import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';
import { sequelize } from '@/db/connect';
import { formatInTimeZone } from 'date-fns-tz';
import { UploadedFile } from './uploadedFiles.model';

export class DirectionalFinder extends Model<
    InferAttributes<DirectionalFinder>,
    InferCreationAttributes<DirectionalFinder>
> {
    declare id: CreationOptional<number>;
    declare tipe_df: string;
    declare teknologi: string;
    declare status: number;
    declare keterangan: string | null;
    declare userCreate: string | null;
    declare tahun_pengadaan: string | null;
    declare wilayah: string | null;
    declare nama_satuan: string | null;
    declare dateCreate: Date;
    declare dateUpdate: Date | null;
}

DirectionalFinder.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        tipe_df: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        teknologi: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        keterangan: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ""
        },
        userCreate: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        tahun_pengadaan: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        wilayah: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        nama_satuan: {
            type: DataTypes.TEXT(),
            allowNull: true,
        },
        dateCreate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: formatInTimeZone(new Date(), 'UTC', 'yyyy-MM-dd HH:mm:ss')
        },
        dateUpdate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'directional_finder',
        timestamps: false,
    }
);

DirectionalFinder.hasMany(UploadedFile, {
    foreignKey: 'directionalFinderId',
    as: 'uploaded_files',
});

UploadedFile.belongsTo(DirectionalFinder, {
    foreignKey: 'directionalFinderId',
    as: 'directionalFinder',
    targetKey: 'id',
    constraints: true
});
