import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, UsePipes } from '@nestjs/common';
import { UserApiService } from './user.api.service';
import { ValidationPipe } from '../shared/validation/validation.pipe';
import { UserDTO } from './user.dto';
import { UserCreateDTO } from './user-create.dto';

@Controller()
export class UserController {
    constructor(private readonly api: UserApiService) {
    }

    @Get('api/users')
    getAll(): any {
        return this.api.findAll();
    }

    @Get('api/users/:username')
    async getOne(@Param('username') username: string): Promise<UserDTO> {
        try {
            const result = await this.api.findByUsername(username);
            return result;
        } catch (ex) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
    }

    @Post('api/users')
    @UsePipes(new ValidationPipe())
    async create(@Body() user: UserCreateDTO): Promise<UserDTO> {
        try {
            const result = await this.api.create(user);
            return result;
        } catch (ex) {
            throw new HttpException(ex.toString(), HttpStatus.BAD_REQUEST);
        }
    }
    @Post('api/login')
    @UsePipes(new ValidationPipe())
    async login(@Body() user: UserCreateDTO): Promise<UserDTO> {
        try {
            const result = await this.api.login(user);
            return result;
        } catch (ex) {
            throw new HttpException(ex.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @Delete('api/users/:username')
    async delete(@Param('username') username: string): Promise<UserDTO> {
        try {
            const result = await this.api.delete(username);
            return result;
        } catch (ex) {
            throw new HttpException(ex.toString(), HttpStatus.NOT_FOUND);
        }
    }
}
