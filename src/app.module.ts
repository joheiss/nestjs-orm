import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from './shared/shared.module';
import { ReceiverModule } from './receiver/receiver.module';
import { OrganizationModule } from './organization/organization.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Connection } from 'typeorm';
import { UserModule } from './user/user.module';


import 'reflect-metadata';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        OrganizationModule,
        ReceiverModule,
        SharedModule,
        UserModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
    ],
})
export class AppModule {

    constructor(private readonly connection: Connection) {
        if (connection) {
            Logger.log(`Connected to database ${this.connection.isConnected}`, 'AppModule');
        }
    }
}
