import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthApiService } from './auth.api.service';
import { UserEntity } from '../user';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
    ],
  controllers: [
      AuthController
  ],
  providers: [
      AuthApiService
  ]
})
export class AuthModule {}
