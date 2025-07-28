// db/connect.ts
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
    process.env.MYSQLDATABASE!,
    process.env.MYSQLUSER!,
    process.env.MYSQLPASSWORD!,
    {
        host: process.env.MYSQLHOST!,
        dialectModule: require('mysql2'),
        dialect: 'mysql',
        logging: false,
    }
);
