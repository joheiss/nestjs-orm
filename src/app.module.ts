import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import 'reflect-metadata';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Connection } from 'typeorm';
import { ReceiverModule } from './receiver/receiver.module';
import { OrganizationModule } from './organization/organization.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        OrganizationModule,
        ReceiverModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {

    constructor(private readonly connection: Connection) {
        if (connection) {
            Logger.log(`Connected to database ${this.connection.isConnected}`, 'AppModule');
        }
    }
}
