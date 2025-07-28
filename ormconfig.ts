import "reflect-metadata"

import { DataSource } from "typeorm"
import { User } from "./entities/User"
import { DirectionalFinder } from "./entities/DirectionalFinder"
import { UploadedFile } from "./entities/UploadedFile"
import { SatuanKerja } from "./entities/SatuanKerja"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true, // auto-migrate (jangan di production)
    logging: false,
    entities: [User, DirectionalFinder, UploadedFile, SatuanKerja],
})
