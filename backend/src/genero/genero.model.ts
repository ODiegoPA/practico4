import { Artista } from "src/artista/artista.model";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Genero {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;
    @OneToMany(() => Artista, artista => artista.genero)
    artistas: Artista[];
}
