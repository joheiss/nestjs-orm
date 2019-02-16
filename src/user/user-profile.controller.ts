import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Put, UseGuards, UsePipes } from '@nestjs/common';
import { Auth, AuthDTO, AuthorizationGuard, Roles } from '../auth';
import { ValidationPipe } from '../shared/validation/validation.pipe';
import { UserProfileDTO } from './user-profile.dto';
import { UserProfileUpdateDTO } from './user-profile-update.dto';
import { UserProfileApiService } from './user-profile.api.service';

@Controller('api/userprofile')
@UseGuards(AuthorizationGuard)
@Roles()
export class UserProfileController {

    constructor(private readonly api: UserProfileApiService) {}

    @Get(':id')
    async getById(
        @Auth() auth: AuthDTO,
        @Param('id') id: string,
    ): Promise<UserProfileDTO> {
        if (id !== auth.id && !auth.roles.filter(role => role !== 'admin' && role !== 'super')) {
            throw new HttpException('usersetting_get_not_allowed', HttpStatus.FORBIDDEN);
        }
        return await this.api.findById(id);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    async update(
        @Auth('id') userId: string,
        @Param('id') id: string,
        @Body() updates: Partial<UserProfileUpdateDTO>
    ): Promise<UserProfileDTO> {
        Logger.log(`user id: ${id}, ${userId}`, 'UserProfileApiService');
        if (id !== userId) {
            throw new HttpException('userprofile_update_not_allowed', HttpStatus.FORBIDDEN);
        }
        const profile = { id, ...updates } as UserProfileUpdateDTO;
        Logger.log(`update: ${JSON.stringify(profile)}`, 'UserProfileController');
        try {
            return await this.api.update(profile);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
        }
    }
}
