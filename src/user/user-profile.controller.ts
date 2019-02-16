import { Body, Controller, HttpException, HttpStatus, Logger, Param, Put, UseGuards, UsePipes } from '@nestjs/common';
import { Auth, AuthorizationGuard, Roles } from '../auth';
import { ValidationPipe } from '../shared/validation/validation.pipe';
import { UserProfileDTO } from './user-profile.dto';
import { UserProfileUpdateDTO } from './user-profile-update.dto';
import { UserProfileApiService } from './user-profile.api.service';

@Controller('api/userprofile')
@UseGuards(AuthorizationGuard)
@Roles()
export class UserProfileController {

    constructor(private readonly api: UserProfileApiService) {}

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
