import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Artista } from "./artista.model";
import { Repository } from "typeorm";

@Injectable()
export class ArtistaService {
    constructor(
        @InjectRepository(Artista)
        private artistaRepository: Repository<Artista>,
    ) {}

    findAll(): Promise<Artista[]> {
        return this.artistaRepository.find({
            order: {
                nombre: "ASC",
            },
        });
    }
    findById(id: number): Promise<Artista | null> {
        return this.artistaRepository.findOneBy({ id });
    }
    findArtistByGenero(generoId: number): Promise<Artista[]> {
        return this.artistaRepository.find({
            where: {
                genero: { id: generoId },
            },
            order: {
                nombre: "ASC",
            },
        });
    }
    create(artista: Artista): Promise<Artista> {
        return this.artistaRepository.save(artista);
    }
    async updateArtista(id: number, artistaData: Partial<Artista>): Promise<Artista> {
        await this.artistaRepository.update(id, artistaData);
        return this.artistaRepository.findOne({ where: { id } });
    }
    async deleteArtista(id: number): Promise<void> {
        const result = await this.artistaRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`No se encontró el artista con id ${id}`);
        }
    }
    async findByName(name: string): Promise<Artista[]> {
        const query = `
            SELECT *
            FROM artista
            WHERE LOWER(nombre) LIKE LOWER('${name}%')
        `;
        const results = await this.artistaRepository.query(query);
        return results;
    }
}
