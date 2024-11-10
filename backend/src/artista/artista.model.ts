import { Album } from "src/album/album.model";
import { Genero } from "src/genero/genero.model";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Artista {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    oyentes: number;

    @ManyToOne(() => Genero, genero => genero.artistas)
    genero: Genero;

    @OneToMany(() => Album, album => album.artista)
    albums: Album[];

    @Column({ nullable: true })
    generoId: number;
}
