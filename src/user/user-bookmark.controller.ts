import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { Auth, AuthDTO, AuthUtility, AuthorizationGuard, Roles } from '../auth';
import { ValidationPipe } from '../shared/validation/validation.pipe';
import { UserBookmarkDTO } from './user-bookmark.dto';
import { UserBookmarkCreateDTO } from './user-bookmark-create.dto';
import { UserBookmarkApiService } from './user-bookmark.api.service';

@Controller('api/userbookmark')
@UseGuards(AuthorizationGuard)
@Roles()
export class UserBookmarkController {

    constructor(private readonly api: UserBookmarkApiService) {}

    @Get(':id/:type/:objectId')
    async getByUserTypeAndObjectId(
        @Auth('id') userId: string,
        @Param('id') id: string,
        @Param('type') type: string,
        @Param('objectId') objectId: string,
    ): Promise<UserBookmarkDTO> {

        if (!AuthUtility.isOwner(id, userId)) {
            throw new HttpException('userbookmark_get_not_allowed', HttpStatus.FORBIDDEN);
        }

        try {
            return await this.api.findByUserIdTypeAndObjectId(id, type, objectId);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
        }
    }

    @Get(':id/:type')
    async getByUserAndType(
        @Auth('id') userId: string,
        @Param('id') id: string,
        @Param('type') type: string,
    ): Promise<UserBookmarkDTO[]> {

        if (!AuthUtility.isOwner(id, userId)) {
            throw new HttpException('userbookmark_get_not_allowed', HttpStatus.FORBIDDEN);
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
    ): Promise<UserBookmarkDTO[]> {

        if (!AuthUtility.isOwner(id, userId)) {
            throw new HttpException('userbookmark_get_not_allowed', HttpStatus.FORBIDDEN);
        }
        return await this.api.findByUserId(id);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async create(
        @Auth('id') userId: string,
        @Param('id') id: string,
        @Param('type') type: string,
        @Param('objectId') objectId: string,
        @Body() updates: UserBookmarkCreateDTO,
    ): Promise<UserBookmarkDTO> {

        if (!AuthUtility.isOwner(id, userId)) {
            throw new HttpException('userbookmark_create_not_allowed', HttpStatus.FORBIDDEN);
        }

        const setting = { ...updates, id, type, objectId } as UserBookmarkCreateDTO;
        try {
            return await this.api.create(setting);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
        }
    }

    @Delete(':id/:type/:objectId')
    async deleteByUserTypeAndObjectId(
        @Auth('id') userId: string,
        @Param('id') id: string,
        @Param('type') type: string,
        @Param('objectId') objectId: string,
    ): Promise<UserBookmarkDTO> {

        if (!AuthUtility.isOwner(id, userId)) {
            throw new HttpException('userbookmark_delete_not_allowed', HttpStatus.FORBIDDEN);
        }

        try {
            return await this.api.delete(id, type, objectId);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
        }
    }

    @Delete(':id/:type')
    async deleteByUserAndType(
        @Auth('id') userId: string,
        @Param('id') id: string,
        @Param('type') type: string,
    ): Promise<UserBookmarkDTO[]> {

        if (!AuthUtility.isOwner(id, userId)) {
            throw new HttpException('userbookmark_delete_not_allowed', HttpStatus.FORBIDDEN);
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
        : Promise<UserBookmarkDTO[]> {

        if (!AuthUtility.isOwner(id, auth.id) && !AuthUtility.isAdmin(auth)) {
            throw new HttpException('userbookmark_delete_not_allowed', HttpStatus.FORBIDDEN);
        }

        try {
            return await this.api.deleteByUserId(id);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
        }
    }
}
