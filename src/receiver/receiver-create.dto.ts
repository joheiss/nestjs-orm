import {
    IsAlpha,
    IsBoolean,
    IsEmail,
    IsInt,
    IsOptional,
    IsPhoneNumber,
    IsString,
    IsUppercase,
    IsUrl,
    Max,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';

export class ReceiverCreateDTO {
    @IsOptional() @IsString()
    objectType?: string;
    @IsOptional() @IsString()
    organization: string;
    @IsOptional() @IsBoolean()
    isDeletable?: boolean;
    @IsOptional() @IsInt() @Min(0) @Max(1)
    status?: number;
    @IsString()
    name: string;
    @IsOptional() @IsString()
    nameAdd?: string;
    @IsAlpha() @IsUppercase() @MinLength(2) @MaxLength(3)
    country: string;
    @IsOptional() @IsString()
    postalCode?: string;
    @IsOptional() @IsString()
    city?: string;
    @IsOptional() @IsString()
    street?: string;
    @IsOptional() @IsEmail()
    email?: string;
    @IsOptional() @IsPhoneNumber('ZZ')
    phone?: string;
    @IsOptional() @IsPhoneNumber('ZZ')
    fax?: string;
    @IsOptional() @IsUrl()
    webSite?: string;
}
