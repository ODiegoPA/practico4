import { Controller, Get, Res, Put, Delete, Post, Body, NotFoundException, Param, UseInterceptors, UploadedFile } from "@nestjs/common";
import { ArtistaService } from "./artista.service";
import { Artista } from "./artista.model";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { extname } from "path";
import * as path from "path";
import * as fs from "fs";
import { Response } from "express";

@Controller("artista")
export class ArtistaController {
    constructor(private artistaService: ArtistaService) {}
    @Get()
    list(): Promise<Artista[]> {
        return this.artistaService.findAll();
    }
    @Get(":id")
    async get(@Param("id") id: number): Promise<Artista | null> {
        const artistaDB = await this.artistaService.findById(id);
        if (!artistaDB) {
            throw new NotFoundException(`No se encontró el artista con id ${id}`);
        }
        return artistaDB;
    }
    @Post()
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: path.join(__dirname, "../../public/images/artistas"),
                filename: (req, file, callback) => {
                    const tempFilename = `temp-${Date.now()}${extname(file.originalname)}`;
                    callback(null, tempFilename);
                },
            }),
        }),
    )
    async uploadFile(@Body() artistaData: Artista, @UploadedFile() file: Express.Multer.File) {
        const artistaCreado = await this.artistaService.create(artistaData);

        const fileExtension = extname(file.originalname);
        const tempFilePath = path.join(__dirname, "../../public/images/artistas", file.filename);
        const newFilePath = path.join(__dirname, "../../public/images/artistas", `${artistaCreado.id}.jpg`);

        if (fs.existsSync(tempFilePath)) {
            fs.renameSync(tempFilePath, newFilePath);
            console.log("Imagen guardada en:", newFilePath);
        } else {
            console.error("El archivo temporal no existe:", tempFilePath);
        }

        return {
            message: "Artista y archivo subidos exitosamente",
            artista: artistaCreado,
            file: `${artistaCreado.id}${fileExtension}`,
        };
    }
    @Get("image/:id")
    async getImage(@Param("id") id: string, @Res() res: Response) {
        const imagePath = path.join(__dirname, "../../public/images/artistas", `${id}.jpg`);
        if (fs.existsSync(imagePath)) {
            res.sendFile(imagePath);
        } else {
            res.sendFile(path.join(__dirname, "../../public/images", "no-image.jpg"));
        }
    }
    @Put(":id")
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: path.join(__dirname, "../../public/images/artistas"),
                filename: (req, file, callback) => {
                    const tempFilename = `temp-${Date.now()}${extname(file.originalname)}`;
                    callback(null, tempFilename);
                },
            }),
        }),
    )
    async update(@Param("id") id: number, @Body() artistaData: Partial<Artista>, @UploadedFile() file: Express.Multer.File) {
        const artistaActualizado = await this.artistaService.updateArtista(id, artistaData);

        if (file) {
            const tempFilePath = path.join(__dirname, "../../public/images/artistas", file.filename);
            const newFilePath = path.join(__dirname, "../../public/images/artistas", `${id}.jpg`);

            if (fs.existsSync(tempFilePath)) {
                fs.renameSync(tempFilePath, newFilePath);
                console.log("Imagen actualizada en:", newFilePath);
            } else {
                console.error("El archivo temporal no existe:", tempFilePath);
            }
        }

        return {
            message: "Artista actualizado exitosamente",
            artista: artistaActualizado,
            ...(file && { file: `${id}.jpg` }),
        };
    }
    @Delete(":id")
    async delete(@Param("id") id: number): Promise<void> {
        const artistaDB = await this.artistaService.findById(id);
        if (!artistaDB) {
            throw new NotFoundException(`No se encontró el artista con id ${id}`);
        }
        return this.artistaService.deleteArtista(id);
    }
    @Get("nombre/:name")
    async findByName(@Param("name") name: string): Promise<Artista[]> {
        return this.artistaService.findByName(name);
    }
    @Get("genero/:id")
    async findByGenero(@Param("id") id: number): Promise<Artista[]> {
        return this.artistaService.findArtistByGenero(id);
    }
}
