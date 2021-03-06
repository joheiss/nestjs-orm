import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUrl, MinLength } from 'class-validator';

export class UserCreateDTO {
    @IsString() @IsNotEmpty()
    id: string;
    @IsString() @IsNotEmpty() @MinLength(8)
    password: string;
    @IsOptional() @IsString()
    organization: string;
    @IsOptional() @IsArray()
    roles: string[];
    @IsString() @IsNotEmpty()
    displayName: string;
    @IsEmail()
    email: string;
    @IsOptional() @IsPhoneNumber('ZZ')
    phone: string;
    @IsOptional() @IsUrl()
    imageUrl: string;
}
