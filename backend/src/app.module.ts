import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GeneroController } from "./genero/genero.controller";
import { GeneroService } from "./genero/genero.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Genero } from "./genero/genero.model";
import { ArtistaController } from "./artista/artista.controller";
import { ArtistaService } from "./artista/artista.service";
import { AlbumController } from "./album/album.controller";
import { AlbumService } from "./album/album.service";
import { CancionController } from "./cancion/cancion.controller";
import { CancionService } from "./cancion/cancion.service";
import { Artista } from "./artista/artista.model";
import { Album } from "./album/album.model";
import { Cancion } from "./cancion/cancion.model";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "root",
            database: "spotify",
            entities: [Genero, Artista, Album, Cancion],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([Genero, Artista, Album, Cancion]),
    ],
    controllers: [AppController, GeneroController, ArtistaController, AlbumController, CancionController],
    providers: [AppService, GeneroService, ArtistaService, AlbumService, CancionService],
})
export class AppModule {}
