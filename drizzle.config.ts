import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
  },
} satisfies Config;
