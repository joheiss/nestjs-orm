import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserApiService } from './user.api.service';
import { UserEntity } from './user.entity';
import { OrganizationApiService, OrganizationEntity } from '../organization';
import { UserProfileEntity } from './user-profile.entity';
import { UserProfileController } from './user-profile.controller';
import { UserProfileApiService } from './user-profile.api.service';
import { UserSettingEntity } from './user-setting.entity';
import { UserSettingController } from './user-setting.controller';
import { UserSettingApiService } from './user-setting.api.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            UserProfileEntity,
            UserSettingEntity,
            OrganizationEntity
        ]),
    ],
  controllers: [
      UserController,
      UserProfileController,
      UserSettingController
  ],
  providers: [
      UserApiService,
      UserProfileApiService,
      UserSettingApiService,
      OrganizationApiService
  ]
})
export class UserModule {}
