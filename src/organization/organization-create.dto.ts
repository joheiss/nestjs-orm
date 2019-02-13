import { IsBoolean, IsInt, IsOptional, IsString, IsUppercase, Max, Min } from 'class-validator';

export class OrganizationCreateDTO {
    @IsString()
    id: string;
    @IsOptional() @IsString()
    objectType?: string;
    @IsOptional() @IsInt() @Min(0) @Max(1)
    status?: number;
    @IsOptional() @IsBoolean()
    isDeletable?: boolean;
    @IsString()
    name: string;
    @IsString()
    timezone: string;
    @IsString() @IsUppercase()
    currency: string;
    @IsString()
    locale: string;
    @IsOptional() @IsString()
    parentId?: string;
}
