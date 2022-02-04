import { IsString, IsInt, IsEmail } from 'class-validator';
export class UserDto {
    @IsString()
    name: string;
    @IsString()
    username: string;
    @IsString()
    @IsEmail()
    email: string;
    @IsString()
    password: string

}