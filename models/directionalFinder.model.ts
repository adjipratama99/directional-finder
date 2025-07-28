import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';
import { sequelize } from '@/db/connect';

export class DirectionalFinder extends Model<
    InferAttributes<DirectionalFinder>,
    InferCreationAttributes<DirectionalFinder>
> {
    declare id: CreationOptional<number>;
    declare tipe_df: string;
    declare teknologi: string;
    declare status: number;
    declare keterangan: string | null;
    declare userCreate: number | null;
    declare tahun_pengadaan: string | null;
    declare wilayah: string | null;
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
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                const rawValue = this.getDataValue("teknologi") as unknown;
                return rawValue ? (rawValue as string).split(',') : [];
            },
            set(value: string[]) {
                this.setDataValue("teknologi", value.join(","));
            }

        },
        status: {
            type: DataTypes.INTEGER(),
            allowNull: false,
        },
        keterangan: {
            type: DataTypes.STRING(255),
            allowNull: false,
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
        dateCreate: {
            type: DataTypes.DATE,
            allowNull: false,
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
