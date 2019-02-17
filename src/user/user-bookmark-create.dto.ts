import { IsNotEmpty, IsString } from 'class-validator';

export class UserBookmarkCreateDTO {
    @IsString() @IsNotEmpty()
    id: string;
    @IsString() @IsNotEmpty()
    type: string;
    @IsString() @IsNotEmpty()
    objectId: string;
}
