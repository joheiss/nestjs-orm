import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from './shared/shared.module';
import { ReceiverModule } from './receiver/receiver.module';
import { OrganizationModule } from './organization/organization.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Connection } from 'typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

import 'reflect-metadata';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        SharedModule,
        AuthModule,
        UserModule,
        OrganizationModule,
        ReceiverModule
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
