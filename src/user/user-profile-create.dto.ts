import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUrl } from 'class-validator';

export class UserProfileCreateDTO {
    @IsString() @IsNotEmpty()
    id: string;
    @IsString() @IsNotEmpty()
    displayName: string;
    @IsEmail()
    email: string;
    @IsOptional() @IsPhoneNumber('ZZ')
    phone: string;
    @IsOptional() @IsUrl()
    imageUrl: string;
}
