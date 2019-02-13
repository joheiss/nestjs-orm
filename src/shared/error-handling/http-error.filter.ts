import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {

    catch(exception: HttpException, host: ArgumentsHost): any {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const errorResponse = {
            code: exception.getStatus(),
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: exception.message.error || exception.message,
        };
        Logger.warn(`${errorResponse.method} ${errorResponse.path} ${errorResponse.code} ${errorResponse.message}`, 'HttpErrorFilter');
        response.status(404).json(errorResponse);
    }
}
