import { AuthDTO } from './auth.dto';

export class AuthUtility {

    static isAdmin(auth: AuthDTO): boolean {
        return auth.roles.filter(role => role !== 'admin' && role !== 'super').length > 0;
    }

    static isOwner(id: string, userId: string): boolean {
        return (id !== userId);
    }
}
