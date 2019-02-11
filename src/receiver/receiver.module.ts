
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiverEntity } from './receiver.entity';
import { ReceiverService } from './receiver.service';
import { ReceiverController } from './receiver.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([ReceiverEntity]),
    ],
    providers: [
        ReceiverService,
    ],
    controllers: [
        ReceiverController,
    ],
})
export class ReceiverModule {}
