import { Controller, Get, Res, Put, Delete, Post, Body, NotFoundException, Param, UseInterceptors, UploadedFile } from "@nestjs/common";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { extname } from "path";
import * as path from "path";
import * as fs from "fs";
import { Response } from "express";
import { AlbumService } from "./album.service";
import { Album } from "./album.model";
@Controller("album")
export class AlbumController {
    constructor(private albumService: AlbumService) {}
    @Get()
    list(): Promise<Album[]> {
        return this.albumService.findAll();
    }
    @Get(":id")
    async get(@Param("id") id: number): Promise<Album | null> {
        const albumDB = await this.albumService.findById(id);
        if (!albumDB) {
            throw new NotFoundException(`No se encontró el album con id ${id}`);
        }
        return albumDB;
    }
    @Post()
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: path.join(__dirname, "../../public/images/albums"),
                filename: (req, file, callback) => {
                    const tempFilename = `temp-${Date.now()}${extname(file.originalname)}`;
                    callback(null, tempFilename);
                },
            }),
        }),
    )
    async uploadFile(@Body() albumData: Album, @UploadedFile() file: Express.Multer.File) {
        const albumCreado = await this.albumService.create(albumData);

        const fileExtension = extname(file.originalname);
        const tempFilePath = path.join(__dirname, "../../public/images/albums", file.filename);
        const newFilePath = path.join(__dirname, "../../public/images/albums", `${albumCreado.id}.jpg`);

        if (fs.existsSync(tempFilePath)) {
            fs.renameSync(tempFilePath, newFilePath);
            console.log("Imagen guardada en:", newFilePath);
        } else {
            console.error("El archivo temporal no existe:", tempFilePath);
        }

        return {
            message: "Album y archivo subidos exitosamente",
            album: albumCreado,
            file: `${albumCreado.id}${fileExtension}`,
        };
    }
    @Get("image/:id")
    async getImage(@Param("id") id: string, @Res() res: Response) {
        const imagePath = path.join(__dirname, "../../public/images/albums", `${id}.jpg`);
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
                destination: path.join(__dirname, "../../public/images/albums"),
                filename: (req, file, callback) => {
                    const tempFilename = `temp-${Date.now()}${extname(file.originalname)}`;
                    callback(null, tempFilename);
                },
            }),
        }),
    )
    async update(@Param("id") id: number, @Body() albumData: Album, @UploadedFile() file: Express.Multer.File) {
        const albumActualizado = await this.albumService.updateAlbum(id, albumData);

        if (file) {
            const tempFilePath = path.join(__dirname, "../../public/images/albums", file.filename);
            const newFilePath = path.join(__dirname, "../../public/images/albums", `${albumActualizado.id}.jpg`);

            if (fs.existsSync(tempFilePath)) {
                fs.renameSync(tempFilePath, newFilePath);
                console.log("Imagen actualizada en:", newFilePath);
            } else {
                console.error("El archivo temporal no existe:", tempFilePath);
            }
        }

        return {
            message: "Album actualizado exitosamente",
            album: albumActualizado,
            ...(file && { file: `${id}.jpg` }),
        };
    }
    @Delete(":id")
    async delete(@Param("id") id: number): Promise<void> {
        const albumDB = await this.albumService.findById(id);
        if (!albumDB) {
            throw new NotFoundException(`No se encontró el album con id ${id}`);
        }
        await this.albumService.deleteAlbum(id);
    }
    @Get("nombre/:name")
    async findByName(@Param("name") name: string): Promise<Album[]> {
        return this.albumService.findByName(name);
    }
    @Get("artista/:id")
    async findByArtista(@Param("id") id: number): Promise<Album[]> {
        return this.albumService.findAlbumByArtista(id);
    }
}
