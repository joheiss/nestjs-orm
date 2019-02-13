import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './error-handling/http-error.filter';
import { LoggingInterceptor } from './logging/logging.interceptor';

@Module({
    imports: [],
    controllers: [],
    providers: [
        { provide: APP_FILTER, useClass: HttpErrorFilter },
        { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    ],
})
export class SharedModule {}
