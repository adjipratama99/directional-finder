// db/connect.ts
import { Sequelize } from 'sequelize';
import pg from 'pg';

if (!process.env.POSTGRES_URL) {
    throw new Error('Missing SUPABASE_PUBLIC_URL in environment variables');
}

export const sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
            cert: process.env.CA_CERTIFICATE
        },
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});
