import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('directional_finder')
export class DirectionalFinder {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    tipe_df!: string;

    @Column("simple-array")
    teknologi!: string[];

    @Column()
    status!: number;

    @Column()
    userCreate!: string;

    @Column({ default: "" })
    tahun_pengadaan!: string;

    @Column({ default: "" })
    keterangan!: string;

    @Column()
    wilayah!: string;

    @Column({ type: 'datetime', nullable: true })
    dateCreate?: Date;

    @Column({ type: 'datetime', nullable: true })
    dateUpdate?: Date;

    @OneToMany(() => {
        const { UploadedFile } = require('./UploadedFile');
        return UploadedFile;
    }, (file: any) => file.directional_finder, {
        cascade: true,
    })
    uploaded_files!: any[];
}
