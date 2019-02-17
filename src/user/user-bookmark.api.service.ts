import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBookmarkEntity } from './user-bookmark.entity';
import { UserBookmarkDTO } from './user-bookmark.dto';
import { UserBookmarkCreateDTO } from './user-bookmark-create.dto';

@Injectable()
export class UserBookmarkApiService {
    constructor(
        @InjectRepository(UserBookmarkEntity) private readonly repository: Repository<UserBookmarkEntity>) {}

    findByUserId(id: string): Promise<UserBookmarkDTO[]> {
        return this.findMany(id).then(res => res.map(r => r.toDTO()));
    }

    findByUserIdAndType(id: string, type: string): Promise<UserBookmarkDTO[]> {
        return this.findMany(id, type).then(res => res.map(r => r.toDTO()));
    }

    findByUserIdTypeAndObjectId(id: string, type: string, objectId: string): Promise<UserBookmarkDTO> {
        return this.findOne(id, type, objectId).then(res => res.toDTO());
    }

    async create(bookmark: UserBookmarkCreateDTO): Promise<UserBookmarkDTO> {
        try {
            if (await this.exists(bookmark.id, bookmark.type, bookmark.objectId)) {
                throw new Error('userbookmark_already_exists');
            }
            const merged = { ...bookmark };
            const entity = this.repository.create(merged);
            const result = await this.repository.save(entity);
            if (!result) {
                throw new Error('userbookmark_not_created');
            }
            return result.toDTO();
        } catch (ex) {
            throw new Error(ex.message);
        }
    }

    async deleteByUserId(id: string): Promise<UserBookmarkDTO[]> {
        const entities = await this.findMany(id);
        if (!entities || !entities.length) {
            throw new Error('userbookmark_not_found');
        }
        return this.repository.remove(entities)
            .then(res => res.map(r => r.toDTO()));
    }

    async deleteByUserIdAndType(id: string, type: string): Promise<UserBookmarkDTO[]> {
        const entity = await this.findMany(id, type);
        if (!entity) {
            throw new Error('userbookmark_not_found');
        }
        return this.repository.remove(entity)
            .then(res => res.map(r => r.toDTO()));
    }

    async delete(id: string, type: string, objectId: string): Promise<UserBookmarkDTO> {
        const entity = await this.findOne(id, type, objectId);
        if (!entity) {
            throw new Error('userbookmark_not_found');
        }
        return this.repository.remove(entity)
            .then(res => res.toDTO());
    }

    private async exists(id: string, type: string, objectId: string): Promise<boolean> {
        const found = await this.findOne(id, type, objectId);
        return !!found;
    }

    private async findMany(id: string, type?: string): Promise<UserBookmarkEntity[]> {
        if (type) {
            return this.repository.find({ where: { id, type }});
        }
        return this.repository.find({ where: { id }});
    }

    private async findOne(id: string, type: string, objectId: string): Promise<UserBookmarkEntity> {
        return this.repository.find({ where: { id, type, objectId }}).then(res => res[0]);
    }
}
