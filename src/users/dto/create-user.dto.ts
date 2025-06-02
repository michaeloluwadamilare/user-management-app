import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({message: 'Name is required'})
    name: string

    @IsEmail()
    email: string

    @IsString()
    username: string

    @IsString()
    password: string

    @IsEnum(["INTERN", "ADMIN", "ENGINEER"], {message: 'Valid role required'})
    role: "INTERN" | "ADMIN" | "ENGINEER"

}