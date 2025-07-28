import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('uploaded_files')
export class UploadedFile {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    file_name!: string;

    @Column()
    uploaded_by!: string;

    @ManyToOne(() => {
        const { DirectionalFinder } = require('./DirectionalFinder');
        return DirectionalFinder;
    }, (df: any) => df.uploaded_files, { onDelete: 'CASCADE' })
    directional_finder!: any;
}
