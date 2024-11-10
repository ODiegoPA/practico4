import { Controller, Get, Res, Put, Delete, Post, Body, NotFoundException, Param, UseInterceptors, UploadedFile } from "@nestjs/common";
import { Response } from "express";
import { GeneroService } from "./genero.service";
import { Genero } from "./genero.model";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { extname } from "path";
import * as path from "path";
import * as fs from "fs";

@Controller("genero")
export class GeneroController {
    constructor(private generoService: GeneroService) {}
    @Get()
    list(): Promise<Genero[]> {
        return this.generoService.findAll();
    }
    @Get(":id")
    async get(@Param("id") id: number): Promise<Genero | null> {
        const generoDB = await this.generoService.findById(id);
        if (!generoDB) {
            throw new NotFoundException(`No se encontró el género con id ${id}`);
        }
        return generoDB;
    }
    @Post()
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: path.join(__dirname, "../../public/images/generos"),
                filename: (req, file, callback) => {
                    const tempFilename = `temp-${Date.now()}${extname(file.originalname)}`;
                    callback(null, tempFilename);
                },
            }),
        }),
    )
    async uploadFile(@Body() generoData: Genero, @UploadedFile() file: Express.Multer.File) {
        const generoCreado = await this.generoService.create(generoData);

        const fileExtension = extname(file.originalname);
        const tempFilePath = path.join(__dirname, "../../public/images/generos", file.filename); // Ruta del archivo temporal
        const newFilePath = path.join(__dirname, "../../public/images/generos", `${generoCreado.id}.jpg`); // Ruta final

        if (fs.existsSync(tempFilePath)) {
            fs.renameSync(tempFilePath, newFilePath);
            console.log("Imagen guardada en:", newFilePath);
        } else {
            console.error("El archivo temporal no existe:", tempFilePath);
        }

        return {
            message: "Género y archivo subidos exitosamente",
            genero: generoCreado,
            file: `${generoCreado.id}${fileExtension}`,
        };
    }
    @Get("image/:id")
    async getImage(@Param("id") id: string, @Res() res: Response) {
        const imagePath = path.join(__dirname, "../../public/images/generos", `${id}.jpg`);

        if (fs.existsSync(imagePath)) {
            res.sendFile(imagePath);
        } else {
            res.status(404).json({ message: "Imagen no encontrada" });
        }
    }
    @Put(":id")
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: path.join(__dirname, "../../public/images/generos"),
                filename: (req, file, callback) => {
                    const tempFilename = `temp-${Date.now()}${path.extname(file.originalname)}`;
                    callback(null, tempFilename);
                },
            }),
        }),
    )
    async updateGenero(@Param("id") id: number, @Body() generoData: Genero, @UploadedFile() file?: Express.Multer.File) {
        const generoActualizado = await this.generoService.updateGenero(id, generoData);

        if (file) {
            const tempFilePath = path.join(__dirname, "../../public/images/generos", file.filename);
            const finalFilePath = path.join(__dirname, "../../public/images/generos", `${id}.jpg`);

            if (fs.existsSync(tempFilePath)) {
                fs.renameSync(tempFilePath, finalFilePath);
                console.log("Imagen actualizada en:", finalFilePath);
            } else {
                console.error("El archivo temporal no existe:", tempFilePath);
            }
        }

        return {
            message: "Género actualizado exitosamente",
            genero: generoActualizado,
            ...(file && { file: `${id}.jpg` }),
        };
    }
    @Delete(":id")
    async delete(@Param("id") id: number): Promise<void> {
        const generoDB = await this.generoService.findById(id);
        if (!generoDB) {
            throw new NotFoundException(`No se encontró el género con id ${id}`);
        }
        return this.generoService.deleteGenero(id);
    }
    @Get("nombre/:name")
    async buscarPorNombre(@Param("name") name: string) {
        return this.generoService.findByName(name);
    }
}
