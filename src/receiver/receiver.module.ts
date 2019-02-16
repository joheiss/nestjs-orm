import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReceiverEntity } from './receiver.entity';
import { ReceiverApiService } from './receiver.api.service';
import { ReceiverController } from './receiver.controller';
import { OrganizationApiService } from '../organization';
import { OrganizationEntity } from '../organization';

@Module({
    imports: [
        TypeOrmModule.forFeature([ReceiverEntity, OrganizationEntity]),
    ],
    providers: [
        ReceiverApiService,
        OrganizationApiService,
    ],
    controllers: [
        ReceiverController,
    ],
})
export class ReceiverModule {
}
