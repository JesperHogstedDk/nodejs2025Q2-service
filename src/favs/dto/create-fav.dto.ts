import { IsArray } from "class-validator";

export class CreateFavDto {
    @IsArray()
    artists: string[];

    @IsArray()
    albums: string[];

    @IsArray()
    tracks: string[];
}
