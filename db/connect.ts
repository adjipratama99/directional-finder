// db/connect.ts
import { Sequelize } from 'sequelize';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cert = fs.readFileSync(path.resolve(__dirname, './prod-ca-2021.crt')).toString();

if (!process.env.POSTGRES_URL_NON_POOLING) {
    throw new Error('Missing SUPABASE_PUBLIC_URL in environment variables');
}

export const sequelize = new Sequelize(process.env.POSTGRES_URL_NON_POOLING, {
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
            cert
        },
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});
