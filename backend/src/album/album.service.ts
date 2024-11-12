import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { Album } from "./album.model";

@Injectable()
export class AlbumService {
    constructor(
        @InjectRepository(Album)
        private albumRepository: Repository<Album>,
    ) {}

    findAll(): Promise<Album[]> {
        return this.albumRepository.find({
            order: {
                nombre: "ASC",
            },
            relations: ["artista"],
        });
    }

    findById(id: number): Promise<Album | null> {
        return this.albumRepository.findOne({
            where: { id },
            relations: ["canciones", "artista"],
        });
    }
    findAlbumByArtista(artistaId: number): Promise<Album[]> {
        return this.albumRepository.find({
            where: {
                artista: { id: artistaId },
            },
            order: {
                ano: "ASC",
            },
            relations: ["canciones", "artista"],
        });
    }
    async findByName(name: string): Promise<Album[]> {
        return this.albumRepository.find({
            where: {
                nombre: Like(`${name}%`),
            },
            relations: ["artista"],
        });
    }
    create(album: Album): Promise<Album> {
        return this.albumRepository.save(album);
    }
    async updateAlbum(id: number, albumData: Partial<Album>): Promise<Album> {
        await this.albumRepository.update(id, albumData);
        return this.albumRepository.findOne({ where: { id } });
    }
    async deleteAlbum(id: number): Promise<void> {
        const result = await this.albumRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`No se encontró el album con id ${id}`);
        }
    }
}
