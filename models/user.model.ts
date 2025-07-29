import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
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
    declare dateCreate: CreationOptional<Date>;
}

User.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
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
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: false,
    }
);

// Relasi
User.hasMany(DirectionalFinder, {
    foreignKey: 'userCreate',
    sourceKey: 'username',
    as: 'directional_finder',
});

DirectionalFinder.belongsTo(User, {
    foreignKey: 'userCreate',
    targetKey: 'username',
    as: 'creator',
});
