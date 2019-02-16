import { Body, Controller, HttpException, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { ValidationPipe } from '../shared/validation/validation.pipe';
import { AuthApiService } from './auth.api.service';
import { AuthCreateDTO } from './auth-create.dto';
import { AuthDTO } from './auth.dto';

@Controller()
export class AuthController {

    constructor(private readonly api: AuthApiService) {
    }

    @Post('api/login')
    @UsePipes(new ValidationPipe())
    async login(@Body() credential: AuthCreateDTO): Promise<AuthDTO> {
        try {
            return await this.api.login(credential);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.BAD_REQUEST);
        }
    }
}
