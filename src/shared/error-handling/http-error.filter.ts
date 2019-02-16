import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {

    catch(exception: HttpException, host: ArgumentsHost): any {

        // Logger.warn(`Exception: ${JSON.stringify(exception)}`, 'HttpErrorFilter');

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const errorResponse = {
            code: typeof exception.getStatus === 'function' ? exception.getStatus() : 0,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: exception.message.error || exception.message || 'unknown_exception'
        };

        Logger.warn(`${errorResponse.method} ${errorResponse.path} ${errorResponse.code} ${errorResponse.message}`, 'HttpErrorFilter');
        response.status(404).json(errorResponse);
    }
}
