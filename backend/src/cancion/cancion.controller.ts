import { Controller, Get, Res, Put, Delete, Post, Body, NotFoundException, Param, UseInterceptors, UploadedFile } from "@nestjs/common";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { extname } from "path";
import * as path from "path";
import * as fs from "fs";
import { Response } from "express";
import { Cancion } from "./cancion.model";
import { CancionService } from "./cancion.service";

@Controller("cancion")
export class CancionController {
    constructor(private cancionService: CancionService) {}
    @Get()
    list(): Promise<Cancion[]> {
        return this.cancionService.findAll();
    }
    @Get(":id")
    async get(@Param("id") id: number): Promise<Cancion | null> {
        const cancionDB = await this.cancionService.findById(id);
        if (!cancionDB) {
            throw new NotFoundException(`No se encontró la cancion con id ${id}`);
        }
        return cancionDB;
    }
    @Post()
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: path.join(__dirname, "../../public/audio/canciones"),
                filename: (req, file, callback) => {
                    const tempFilename = `temp-${Date.now()}${extname(file.originalname)}`;
                    callback(null, tempFilename);
                },
            }),
        }),
    )
    async uploadFile(@Body() cancionData: Cancion, @UploadedFile() file: Express.Multer.File) {
        const cancionCreada = await this.cancionService.create(cancionData);

        const fileExtension = extname(file.originalname);
        const tempFilePath = path.join(__dirname, "../../public/audio/canciones", file.filename);
        const newFilePath = path.join(__dirname, "../../public/audio/canciones", `${cancionCreada.id}.mp3`);

        if (fs.existsSync(tempFilePath)) {
            fs.renameSync(tempFilePath, newFilePath);
            console.log("Audio guardado en:", newFilePath);
        } else {
            console.error("El archivo temporal no existe:", tempFilePath);
        }

        return {
            message: "Cancion y archivo subidos exitosamente",
            cancion: cancionCreada,
            file: `${cancionCreada.id}${fileExtension}`,
        };
    }
    @Get("audio/:id")
    async getAudio(@Param("id") id: string, @Res() res: Response) {
        const audioPath = path.join(__dirname, "../../public/audio/canciones", `${id}.mp3`);
        if (fs.existsSync(audioPath)) {
            res.sendFile(audioPath);
        } else {
            res.status(404).send("Audio no encontrado");
        }
    }
    @Put(":id")
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: path.join(__dirname, "../../public/audio/canciones"),
                filename: (req, file, callback) => {
                    const tempFilename = `temp-${Date.now()}${extname(file.originalname)}`;
                    callback(null, tempFilename);
                },
            }),
        }),
    )
    async update(@Param("id") id: number, @Body() cancionData: Cancion, @UploadedFile() file: Express.Multer.File) {
        const cancionActualizada = await this.cancionService.updateCancion(id, cancionData);

        if (file) {
            const tempFilePath = path.join(__dirname, "../../public/audio/canciones", file.filename);
            const newFilePath = path.join(__dirname, "../../public/audio/canciones", `${id}.mp3`);

            if (fs.existsSync(tempFilePath)) {
                fs.renameSync(tempFilePath, newFilePath);
                console.log("Audio guardado en:", newFilePath);
            } else {
                console.error("El archivo temporal no existe:", tempFilePath);
            }
        }

        return {
            message: "Cancion actualizada exitosamente",
            cancion: cancionActualizada,
            ...(file && { file: `${id}.mp3` }),
        };
    }
    @Delete(":id")
    async delete(@Param("id") id: number): Promise<void> {
        const cancionDB = await this.cancionService.findById(id);
        if (!cancionDB) {
            throw new NotFoundException(`No se encontró la cancion con id ${id}`);
        }
        await this.cancionService.deleteCancion(id);
    }
    @Get("nombre/:name")
    async findByName(@Param("name") name: string): Promise<Cancion[]> {
        return this.cancionService.findByName(name);
    }
}
