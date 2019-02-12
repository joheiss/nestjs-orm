
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrganizationEntity } from './organization.entity';
import { OrganizationApiService } from './organization.api.service';
import { OrganizationController } from './organization.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([OrganizationEntity]),
    ],
    providers: [
        OrganizationApiService,
    ],
    controllers: [
        OrganizationController,
    ],
})
export class OrganizationModule {}
