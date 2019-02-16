import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthenticationGuard implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (!request.headers.authorization) {
            return false;
        }
        request.user = await this.validateToken(request.headers.authorization);
        Logger.log(`Request User: ${request.user}`, 'AuthenticationGuard');
        return !!request.user;
    }

    private async validateToken(auth: string): Promise<any> {
        const elements = auth.split(' ');
        if (elements[0] !== 'Bearer') {
            return false;
        }
        try {
            const token = elements[1];
            const secret = process.env.SECRET || '';
            return await jwt.verify(token, secret);
        } catch (ex) {
            return false;
        }
    }
}
