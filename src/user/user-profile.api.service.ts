import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfileEntity } from './user-profile.entity';
import { UserProfileUpdateDTO } from './user-profile-update.dto';
import { UserProfileDTO } from './user-profile.dto';

@Injectable()
export class UserProfileApiService {
    constructor(
        @InjectRepository(UserProfileEntity) private readonly repository: Repository<UserProfileEntity>
 ) {}

    async update(updates: UserProfileUpdateDTO): Promise<UserProfileDTO> {
        try {
            const found = await this.findOne(updates.id);
            if (!found) {
                throw new Error('userprofile_not found');
            }
            const merged = Object.assign({}, { ...found }, { ...updates });
            const entity = this.repository.create(merged);
            const result = await this.repository.save(entity);
            if (!result) {
                throw new Error('userprofile_update_failed');
            }
            return result.toDTO();
        } catch (ex) {
            throw new Error(ex.message);
        }
    }

    private async findOne(id: string): Promise<UserProfileEntity | undefined> {
        return this.repository.findOne(id);
    }
}
