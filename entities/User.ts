import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    username!: string

    @Column({ unique: true })
    password!: string

    @Column()
    role!: string

    @Column({ default: 1 })
    status?: number

    @Column({ default: "" })
    satuan_wilayah?: string

    @Column({ default: ""})
    wilayah?: string

    @Column({ default: ""})
    nama_satuan?: string

    @Column({ type: "date", nullable: true, default: null })
    dateUpdate?: Date | null

    @Column({ type: "date", nullable: false, })
    dateCreate?: Date
}
