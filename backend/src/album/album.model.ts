import { Artista } from "src/artista/artista.model";
import { Cancion } from "src/cancion/cancion.model";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Album {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    ano: number;

    @ManyToOne(() => Artista, artista => artista.albums)
    artista: Artista;

    @OneToMany(() => Cancion, cancion => cancion.album)
    canciones: Cancion[];

    @Column({ nullable: true })
    artistaId: number;
}
