import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthorizationGuard implements CanActivate {

    constructor(private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean>  {

        const request = context.switchToHttp().getRequest();
        request.user = await this.getAuthentication(context);
        if (!request.user) {
            return false;
        }

        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        Logger.log(`roles: ${roles}`, 'AuthorizationGuard');

        const auth = request.user;
        Logger.log(`Auth: ${JSON.stringify(auth)}`, 'AuthorizationGuard');
        const hasRole = () => auth.roles.some((role: string) => roles.includes(role));
        return auth && auth.roles && hasRole();
    }

    private async getAuthentication(context: ExecutionContext): Promise<any> {
        const request = context.switchToHttp().getRequest();
        if (!request.headers.authorization) {
            return false;
        }
        return await this.validateToken(request.headers.authorization);
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
