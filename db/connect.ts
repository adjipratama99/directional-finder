// db/connect.ts
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(process.env.MYSQL_PUBLIC_URL!, {
    dialectModule: require('mysql2'),
    dialect: 'mysql',
    logging: console.log,
});
