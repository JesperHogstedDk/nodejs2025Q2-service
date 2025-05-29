import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsEmail()
    login: string;

    @IsString()
    password: string;
}
