import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserSettingCreateUpdateDTO {
    @IsString() @IsNotEmpty()
    id: string;
    @IsString() @IsNotEmpty()
    type: string;
    @IsOptional() @IsInt()
    listLimit: number;
    @IsOptional() @IsInt()
    bookmarkExpiration: number;
}
