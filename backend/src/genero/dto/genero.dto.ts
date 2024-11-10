import { IsString } from "class-validator";

export class CreateGeneroDto {
    @IsString()
    readonly nombre: string;
}
