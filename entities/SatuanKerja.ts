import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "satuan_kerja" })
export class SatuanKerja {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    wilayah!: string;

    @Column({ type: "varchar", length: 255 })
    satuan_wilayah!: string;

    @Column({ type: "varchar", length: 255 })
    nama_satuan!: string;
}
