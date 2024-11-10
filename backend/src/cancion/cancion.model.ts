import { Album } from "src/album/album.model";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cancion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @ManyToOne(() => Album, album => album.canciones)
    album: Album;
    @Column({ nullable: true })
    albumId: number;
}
