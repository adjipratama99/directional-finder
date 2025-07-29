// db/connect.ts
import { Sequelize } from 'sequelize';
import pg from 'pg';

if (!process.env.POSTGRES_URL_NON_POOLING) {
    throw new Error('Missing SUPABASE_PUBLIC_URL in environment variables');
}

export const sequelize = new Sequelize(process.env.POSTGRES_URL_NON_POOLING, {
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
            cert: process.env.CA_CERTIFICATE
        },
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});
