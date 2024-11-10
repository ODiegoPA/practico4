import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cancion } from "./cancion.model";
import { Like, Repository } from "typeorm";

@Injectable()
export class CancionService {
    constructor(
        @InjectRepository(Cancion)
        private cancionRepository: Repository<Cancion>,
    ) {}

    findAll(): Promise<Cancion[]> {
        return this.cancionRepository.find({
            relations: ["album"],
        });
    }
    findById(id: number): Promise<Cancion | null> {
        return this.cancionRepository.findOne({
            where: { id },
            relations: ["album"],
        });
    }
    async findByName(name: string): Promise<Cancion[]> {
        return this.cancionRepository.find({
            where: {
                nombre: Like(`%${name}%`),
            },
            relations: ["album"], // Incluir la información del álbum
        });
    }
    create(cancion: Cancion): Promise<Cancion> {
        return this.cancionRepository.save(cancion);
    }
    async updateCancion(id: number, cancionData: Partial<Cancion>): Promise<Cancion> {
        await this.cancionRepository.update(id, cancionData);
        return this.cancionRepository.findOne({ where: { id } });
    }
    async deleteCancion(id: number): Promise<void> {
        const result = await this.cancionRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`No se encontró la canción con id ${id}`);
        }
    }
}
