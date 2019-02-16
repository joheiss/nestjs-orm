import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSettingEntity } from './user-setting.entity';
import { UserSettingDTO } from './user-setting.dto';
import { UserSettingCreateUpdateDTO } from './user-setting-create-update.dto';

@Injectable()
export class UserSettingApiService {
    constructor(
        @InjectRepository(UserSettingEntity) private readonly repository: Repository<UserSettingEntity>) {}

    findByUserId(id: string): Promise<UserSettingDTO[]> {
        return this.findMany(id).then(res => res.map(r => r.toDTO()));
    }

    findByUserIdAndType(id: string, type: string): Promise<UserSettingDTO> {
        Logger.log(`findByUserIdAndType: ${id}/${type}`, 'UserSettingApiService');
        return this.findOne(id, type).then(res => res.toDTO());
    }

    async create(setting: UserSettingCreateUpdateDTO): Promise<UserSettingDTO> {
        try {
            if (await this.exists(setting.id, setting.type)) {
                throw new Error('usersetting_already_exists');
            }
            const merged = { ...setting };
            const entity = this.repository.create(merged);
            const result = await this.repository.save(entity);
            if (!result) {
                throw new Error('usersetting_not_created');
            }
            return result.toDTO();
        } catch (ex) {
            throw new Error(ex.message);
        }
    }

    async update(updates: UserSettingCreateUpdateDTO): Promise<UserSettingDTO> {
        try {
            const found = await this.findOne(updates.id, updates.type);
            if (!found) {
                throw new Error('usersetting_not found');
            }
            const merged = { ...updates };
            const entity = this.repository.create(merged);
            const result = await this.repository.save(entity);
            if (!result) {
                throw new Error('usersetting_update_failed');
            }
            return result.toDTO();
        } catch (ex) {
            throw new Error(ex.message);
        }
    }

    async deleteByUserId(id: string): Promise<UserSettingDTO[]> {
        const entities = await this.findMany(id);
        if (!entities || !entities.length) {
            throw new Error('usersettings_not_found');
        }
        return this.repository.remove(entities)
            .then(res => res.map(r => r.toDTO()));
    }

    async deleteByUserIdAndType(id: string, type: string): Promise<UserSettingDTO> {
        const entity = await this.findOne(id, type);
        if (!entity) {
            throw new Error('usersetting_not_found');
        }
        return this.repository.remove(entity)
            .then(res => res.toDTO());
    }

    private async exists(id: string, type: string): Promise<boolean> {
        const found = await this.findOne(id, type);
        return !!found;
    }

    private async findMany(id: string): Promise<UserSettingEntity[]> {
        return this.repository.find({ where: { id }});
    }

    private async findOne(id: string, type: string): Promise<UserSettingEntity> {
        return this.repository.find({ where: { id, type }}).then(res => res[0]);
    }
}
