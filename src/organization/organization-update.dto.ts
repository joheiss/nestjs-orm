import { IsBoolean, IsInt, IsOptional, IsString, IsUppercase, Max, Min } from 'class-validator';

export class OrganizationUpdateDTO {
    @IsString()
    id: string;
    @IsOptional() @IsInt() @Min(0) @Max(1)
    status?: number;
    @IsOptional() @IsBoolean()
    isDeletable?: boolean;
    @IsOptional() @IsString()
    name: string;
    @IsOptional() @IsString()
    timezone: string;
    @IsOptional()  @IsString() @IsUppercase()
    currency: string;
    @IsOptional() @IsString()
    locale: string;
    @IsOptional() @IsString()
    parentId?: string;
}
