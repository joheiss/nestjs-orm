import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { AuthorizationGuard, Roles } from '../auth';
import { ValidationPipe } from '../shared/validation/validation.pipe';

import { UserApiService } from './user.api.service';
import { UserDTO } from './user.dto';
import { UserCreateDTO } from './user-create.dto';
import { UserUpdateDTO } from './user-update.dto';

@Controller('api/users')
@UseGuards(AuthorizationGuard)
@Roles('admin', 'super')
export class UserController {

    constructor(private readonly api: UserApiService) {}

    @Get()
    getAll(): Promise<UserDTO[]> {
        return this.api.findAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: string): Promise<UserDTO> {
        try {
            return await this.api.findById(id);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
        }
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() user: UserCreateDTO): Promise<UserDTO> {
        try {
            return await this.api.create(user);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    async update(
        @Param('id') id: string,
        @Body() updates: Partial<UserUpdateDTO>
    ): Promise<UserDTO> {

        const user = { id, ...updates } as UserUpdateDTO;
        Logger.log(`update: ${JSON.stringify(user)}`, 'UserController');
        try {
            return await this.api.update(user);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
        }
    }

    @Delete(':id')
    async delete(@Param('id') username: string): Promise<UserDTO> {
        try {
            return await this.api.delete(username);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
        }
    }
}
