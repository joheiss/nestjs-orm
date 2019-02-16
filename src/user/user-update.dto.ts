import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUrl, MinLength } from 'class-validator';

export class UserUpdateDTO {
    @IsOptional() @IsString() @IsNotEmpty()
    id: string;
    @IsOptional() @IsString() @IsNotEmpty() @MinLength(8)
    password: string;
    @IsOptional() @IsString()
    organization: string;
    @IsOptional() @IsArray()
    roles: string[];
    @IsOptional() @IsString() @IsNotEmpty()
    displayName: string;
    @IsOptional() @IsEmail() @IsNotEmpty()
    email: string;
    @IsOptional() @IsPhoneNumber('ZZ')
    phone: string;
    @IsOptional() @IsUrl()
    imageUrl: string;
}
