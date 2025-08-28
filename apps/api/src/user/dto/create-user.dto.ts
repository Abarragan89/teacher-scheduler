import { IsEmail, IsString, Max, Min } from 'class-validator'

export class CreateUserDto {

    @IsString()
    name: string

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @Min(8)
    password: string;

}