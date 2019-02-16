import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUrl } from 'class-validator';

export class UserProfileUpdateDTO {
    @IsOptional() @IsString() @IsNotEmpty()
    id: string;
    @IsOptional() @IsString() @IsNotEmpty()
    displayName: string;
    @IsOptional() @IsEmail() @IsNotEmpty()
    email: string;
    @IsOptional() @IsPhoneNumber('ZZ')
    phone: string;
    @IsOptional() @IsUrl()
    imageUrl: string;
}
