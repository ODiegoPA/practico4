import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateArtistaDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;
    @IsNotEmpty()
    @IsNumber()
    oyentes: number;
}
