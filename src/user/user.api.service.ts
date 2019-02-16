import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserDTO } from './user.dto';
import { UserCreateDTO } from './user-create.dto';
import { UserUpdateDTO } from './user-update.dto';
import { OrganizationApiService } from '../organization';
import { UserProfileEntity } from './user-profile.entity';
import { UserSettingEntity } from './user-setting.entity';

@Injectable()
export class UserApiService {
    constructor(
        @InjectRepository(UserEntity) private readonly repository: Repository<UserEntity>,
        @InjectRepository(UserProfileEntity) private readonly profileRepository: Repository<UserProfileEntity>,
        @InjectRepository(UserSettingEntity) private readonly settingRepository: Repository<UserSettingEntity>,
        private readonly orgApi: OrganizationApiService) {}

    async findAll(): Promise<UserDTO[]> {
        return this.repository.find().then(res => res.map(u => u.toDTO()));
    }

    async findById(id: string): Promise<UserDTO> {
        const result = await this.findOne(id);
        if (!result) {
            throw new Error('user_not_found');
        }
        return result.toDTO();
    }

    async create(user: UserCreateDTO): Promise<UserDTO> {
        Logger.log(`user to be created: ${JSON.stringify(user)}`, 'UserApiService');
        try {
            if (await this.exists(user.id)) {
                Logger.log(`user exists but doesn't!`, 'UserApiService');
                throw new Error('user_already_exists');
            }
            await this.orgApi.findById(user.organization);
            const roles = user.roles.join(', ');
            const setting = this.settingRepository.create({ id: user.id, type: 'default' });
            const settings: UserSettingEntity[] = [];
            settings.push(setting);
            const { displayName, email, phone, imageUrl, ...data } = user;
            const profile = { id: user.id, displayName, email, phone, imageUrl, settings };
            const profileEntity = this.profileRepository.create(profile);
            const merged = { ...data, roles, profile: profileEntity };
            const entity = this.repository.create(merged);
            const result = await this.repository.save(entity);
            if (!result) {
                throw new Error('user_not_created');
            }
            return result.toDTO();
        } catch (ex) {
            throw new Error(ex.message);
        }
    }

    async update(updates: UserUpdateDTO): Promise<UserDTO> {
        try {
            const found = await this.findOne(updates.id);
            if (!found) {
                throw new Error('user_not found');
            }
            if (updates.organization) {
                await this.orgApi.findById(updates.organization);
            }
            let roles: string;
            if (updates.roles) {
                roles = updates.roles.join(', ');
            } else {
                roles = found.roles;
            }
            const { displayName, email, phone, imageUrl, ...data } = updates;
            const profile = { id: updates.id, displayName, email, phone, imageUrl };
            const profileEntity = this.profileRepository.create(profile);
            const merged = Object.assign({}, { ...found }, { ...data, profile: profileEntity}, roles);
            const entity = this.repository.create(merged);
            const result = await this.repository.save(entity);
            if (!result) {
                throw new Error('user_update_failed');
            }
            return result.toDTO();
        } catch (ex) {
            throw new Error(ex.message);
        }
    }

    async delete(id: string): Promise<any> {
        const entity = await this.findOne(id);
        if (!entity) {
            throw new Error('user_not_found');
        }
        return this.repository.remove(entity)
            .then(res => res.toDTO());
    }

    private async exists(id: string): Promise<boolean> {
        const found = await this.findOne(id);
        Logger.log(`User exists: ${JSON.stringify(found)}`, 'UserApiService');
        return !!found;
    }

    private async findOne(id: string): Promise<UserEntity | undefined> {
        return this.repository.findOne(id);
    }
}
