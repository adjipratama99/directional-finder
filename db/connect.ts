// db/connect.ts
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASS!,
    {
        host: process.env.DB_HOST!,
        dialectModule: require('mysql2'),
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
        dialect: 'mysql',
        logging: false,
    }
);
