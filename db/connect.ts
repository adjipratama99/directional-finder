// db/connect.ts
import { Sequelize } from 'sequelize';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cert = fs.readFileSync(path.resolve(__dirname, './prod-ca-2021.crt')).toString();

if (!process.env.SUPABASE_PUBLIC_URL) {
    throw new Error('Missing SUPABASE_PUBLIC_URL in environment variables');
}

export const sequelize = new Sequelize(process.env.SUPABASE_PUBLIC_URL, {
    dialect: 'postgres',
    dialectModule: pg,
    ssl: {
        rejectUnauthorized: true,
        cert
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});
