import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthCreateDTO {
    @IsString() @IsNotEmpty()
    id: string;
    @IsString() @IsNotEmpty() @MinLength(8)
    password: string;
}
