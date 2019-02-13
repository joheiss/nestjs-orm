import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserApiService } from './user.api.service';
import { UserEntity } from './user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
    ],
  controllers: [
      UserController
  ],
  providers: [
      UserApiService
  ]
})
export class UserModule {}
