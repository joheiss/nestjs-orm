import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user';
import { Repository } from 'typeorm';
import { AuthDTO } from './auth.dto';
import { AuthCreateDTO } from './auth-create.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthApiService {

    constructor(
        @InjectRepository(UserEntity) private readonly repository: Repository<UserEntity>) {}

    async login(credential: AuthCreateDTO): Promise<AuthDTO> {
        const found = await this.repository.findOne(credential.id);
        if (!found) {
            throw new Error('login_failed');
        }
        const valid = await this.isPasswordValid(found, credential.password);
        if (!valid) {
            throw new Error('login_failed');
        }
        return this.toDTO(found);
    }

    private async isPasswordValid(user: UserEntity, password: string): Promise<boolean> {
        return await bcrypt.compare(password, user.password);
    }

    private getToken(user: UserEntity): string {
        const { id, organization, roles } = user;
        const rolesArray = roles.split(',').map(r => r.trim());
        const secret = process.env.SECRET || '';
        return jwt.sign({ id, organization, roles: rolesArray }, secret, { expiresIn: '1d' });
    }

    private toDTO(user: any): AuthDTO {
        const { password, createdAt, changedAt, objectType, roles, organization, ...dto} = user;
        const rolesArray = roles.split(',').map((r: string) => r.trim());
        const orgId = organization.orgId;
        const token = this.getToken(user);
        return {...dto, organization: orgId, roles: rolesArray, token };
    }
}
