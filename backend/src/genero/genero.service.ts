import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Genero } from "./genero.model";
import { Repository, DataSource } from "typeorm";

@Injectable()
export class GeneroService {
    constructor(
        @InjectRepository(Genero)
        private generoRepository: Repository<Genero>,
        private readonly dataSource: DataSource,
    ) {}

    findAll(): Promise<Genero[]> {
        return this.generoRepository.find();
    }

    findById(id: number): Promise<Genero | null> {
        return this.generoRepository.findOneBy({ id });
    }

    create(genero: Genero): Promise<Genero> {
        return this.generoRepository.save(genero);
    }

    async updateGenero(id: number, generoData: Partial<Genero>): Promise<Genero> {
        await this.generoRepository.update(id, generoData);
        return this.generoRepository.findOne({ where: { id } });
    }

    async deleteGenero(id: number): Promise<void> {
        const result = await this.generoRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`No se encontró el género con id ${id}`);
        }
    }
    async findByName(name: string): Promise<Genero[]> {
        const query = `
            SELECT *
            FROM genero
            WHERE LOWER(nombre) LIKE LOWER('${name}%')
        `;
        const results = await this.dataSource.query(query);
        return results;
    }
}
