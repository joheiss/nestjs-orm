
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiverEntity } from './receiver.entity';
import { ReceiverApiService } from './receiver.api.service';
import { ReceiverController } from './receiver.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([ReceiverEntity]),
    ],
    providers: [
        ReceiverApiService,
    ],
    controllers: [
        ReceiverController,
    ],
})
export class ReceiverModule {}
