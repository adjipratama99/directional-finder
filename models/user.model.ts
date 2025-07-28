import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';
import { sequelize } from '@/db/connect';
import { DirectionalFinder } from './directionalFinder.model';

export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    declare id: CreationOptional<number>;
    declare username: string;
    declare password: string;
    declare role: string;
    declare status: number;
    declare satuan_wilayah: string;
    declare wilayah: string;
    declare nama_satuan: string;
    declare dateUpdate: Date | null;
    declare dateCreate: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        role: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        satuan_wilayah: {
            type: DataTypes.STRING(255),
            defaultValue: '',
        },
        wilayah: {
            type: DataTypes.STRING(255),
            defaultValue: '',
        },
        nama_satuan: {
            type: DataTypes.STRING(255),
            defaultValue: '',
        },
        dateUpdate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        dateCreate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: false,
    }
);

User.hasMany(DirectionalFinder, { foreignKey: "userCreate", sourceKey: "username" });
DirectionalFinder.belongsTo(User, { foreignKey: "userCreate", targetKey: "username" });