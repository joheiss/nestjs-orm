import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { Auth, AuthDTO, AuthUtility, AuthorizationGuard, Roles } from '../auth';
import { ValidationPipe } from '../shared/validation/validation.pipe';
import { UserProfileDTO } from './user-profile.dto';
import { UserSettingCreateUpdateDTO } from './user-setting-create-update.dto';
import { UserSettingDTO } from './user-setting.dto';
import { UserSettingApiService } from './user-setting.api.service';

@Controller('api/usersetting')
@UseGuards(AuthorizationGuard)
@Roles()
export class UserSettingController {

    constructor(private readonly api: UserSettingApiService) {}

    @Get(':id/:type')
    async getByUserAndType(
        @Auth('id') userId: string,
        @Param('id') id: string,
        @Param('type') type: string,
    ): Promise<UserSettingDTO> {

        if (!AuthUtility.isOwner(id, userId)) {
            throw new HttpException('usersetting_get_not_allowed', HttpStatus.FORBIDDEN);
        }

        try {
            return await this.api.findByUserIdAndType(id, type);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
        }
    }

    @Get(':id')
    async getByUserId(
        @Auth('id') userId: string,
        @Param('id') id: string,
    ): Promise<UserSettingDTO[]> {

        if (!AuthUtility.isOwner(id, userId)) {
            throw new HttpException('usersetting_get_not_allowed', HttpStatus.FORBIDDEN);
        }
        return await this.api.findByUserId(id);
    }

    @Post(':id/:type')
    @UsePipes(new ValidationPipe())
    async create(
        @Auth('id') userId: string,
        @Param('id') id: string,
        @Param('type') type: string,
        @Body() updates: UserSettingCreateUpdateDTO,
    ): Promise<UserProfileDTO> {

        Logger.log(`user id: ${id}, ${userId}`, 'UserSettingApiService');
        if (!AuthUtility.isOwner(id, userId)) {
            throw new HttpException('usersetting_create_not_allowed', HttpStatus.FORBIDDEN);
        }

        const setting = { id, type, ...updates } as UserSettingCreateUpdateDTO;
        Logger.log(`update: ${JSON.stringify(setting)}`, 'UserSettingController');
        try {
            return await this.api.create(setting);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
        }
    }

    @Put(':id/:type')
    @UsePipes(new ValidationPipe())
    async update(
        @Auth('id') userId: string,
        @Param('id') id: string,
        @Param('type') type: string,
        @Body() updates: Partial<UserSettingCreateUpdateDTO>,
    ): Promise<UserProfileDTO> {

        Logger.log(`user id: ${id}, ${userId}`, 'UserSettingApiService');
        if (!AuthUtility.isOwner(id, userId)) {
            throw new HttpException('usersetting_update_not_allowed', HttpStatus.FORBIDDEN);
        }

        const setting = { id, type, ...updates } as UserSettingCreateUpdateDTO;
        Logger.log(`update: ${JSON.stringify(setting)}`, 'UserSettingController');
        try {
            return await this.api.update(setting);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
        }
    }

    @Delete(':id/:type')
    async deleteByUserAndType(
        @Auth('id') userId: string,
        @Param('id') id: string,
        @Param('type') type: string,
    ): Promise<UserSettingDTO> {

        if (!AuthUtility.isOwner(id, userId)) {
            throw new HttpException('usersetting_delete_not_allowed', HttpStatus.FORBIDDEN);
        }

        try {
            return await this.api.deleteByUserIdAndType(id, type);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
        }
    }

    @Delete(':id')
    async deleteByUser(
        @Auth() auth: AuthDTO,
        @Param('id') id: string)
        : Promise<UserSettingDTO[]> {

        if (!AuthUtility.isOwner(id, auth.id) && !AuthUtility.isAdmin(auth)) {
            throw new HttpException('usersetting_delete_not_allowed', HttpStatus.FORBIDDEN);
        }

        try {
            return await this.api.deleteByUserId(id);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
        }
    }
}
