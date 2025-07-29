import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
} from 'sequelize';
import { sequelize } from '@/db/connect';
import { DirectionalFinder } from './directionalFinder.model';

export class UploadedFile extends Model<
    InferAttributes<UploadedFile>,
    InferCreationAttributes<UploadedFile>
> {
    declare id: CreationOptional<number>;
    declare file_name: string;
    declare uploaded_by: string | null;
    declare directionalFinderId: ForeignKey<DirectionalFinder['id']>;
}

UploadedFile.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        file_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        uploaded_by: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        directionalFinderId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'directional_finder',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    },
    {
        sequelize,
        tableName: 'uploaded_files',
        timestamps: false,
    }
);
