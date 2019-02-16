import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ReceiverEntity } from './receiver.entity';
import { ReceiverDTO } from './receiver.dto';
import { ReceiverCreateDTO } from './receiver-create.dto';
import { ReceiverUpdateDTO } from './receiver-update.dto';
import { OrganizationApiService } from '../organization';

@Injectable()
export class ReceiverApiService {
    constructor(
        @InjectRepository(ReceiverEntity) private readonly repository: Repository<ReceiverEntity>,
        private readonly orgApi: OrganizationApiService
        ) {}

    findAll(): Promise<ReceiverDTO[]> {
        return this.repository.find()
            .then(res => res.map(r => r.toDTO()));
    }

    async findAllByOrg(orgId: string): Promise<ReceiverDTO[]> {
        try {
            const orgIds = await this.orgApi.findTreeIds(orgId);
            Logger.log(`Allowed Orgs: ${orgIds}`, 'ReceiverApiService');
            return await this.repository
                .createQueryBuilder('receiver')
                .where('receiver.organization IN (:...orgIds)', { orgIds })
                .getMany()
                .then(res => res.map(r => r.toDTO()));
        } catch (ex) {
            throw new Error('ex.message');
        }
    }

   async findById(id: number): Promise<any> {
        const result = await this.repository.findOne({ where: { id } });
        if (!result) {
            throw new Error('receiver_not_found');
        }
        return result.toDTO();
    }

    async findByIdAndOrg(id: number, orgId: string): Promise<any> {
        try {
            const orgIds = await this.orgApi.findTreeIds(orgId);
            Logger.log(`Allowed Orgs: ${orgIds}`, 'ReceiverApiService');
            const result = await this.repository
                .createQueryBuilder('receiver')
                .where('receiver.id = :id', { id})
                .andWhere('receiver.organization IN (:...orgIds)', { orgIds })
                .getOne();
            if (!result) {
                throw new Error('receiver_not_found');
            }
            return result.toDTO();
        } catch (ex) {
            throw new Error(ex.message);
        }
    }

    async create(receiver: ReceiverCreateDTO): Promise<ReceiverDTO> {
        const id = await this.nextId();
        const entity = this.repository.create({...receiver, id});
        const result = await this.repository.save(entity);
        if (!result) {
            throw new Error('receiver_not_created');
        }
        return result.toDTO();
    }

    async createWithOrg(receiver: ReceiverCreateDTO, organization: string): Promise<ReceiverDTO> {
        try {
            const id = await this.nextId();
            if (await this.exists(id)) {
                throw new Error('receiver_already_exists');
            }
            await this.orgApi.findById(organization);
            const entity = this.repository.create({ ...receiver, id, organization });
            const result = await this.repository.save(entity);
            if (!result) {
                throw new Error('receiver_not_created');
            }
            return result.toDTO();
        } catch (ex) {
            throw new Error(ex.message);
        }
    }

    async update(updates: ReceiverUpdateDTO): Promise<ReceiverDTO> {
        try {
            const found = await this.findOne(updates.id);
            if (!found) {
                throw new Error('receiver_not found');
            }
            if (updates.organization) {
                await this.orgApi.findById(updates.organization);
            }
            const merged = Object.assign({}, {...found }, {...updates}) as ReceiverDTO;
            const entity = this.repository.create(merged);
            const result = await this.repository.save(entity);
            if (!result) {
                throw new Error('receiver_update_failed');
            }
            return result.toDTO();
        } catch (ex) {
            throw new Error(ex.message);
        }
    }
    async updateWithOrg(updates: ReceiverUpdateDTO, organization: string): Promise<ReceiverDTO> {
        try {
            const found = await this.findOne(updates.id);
            if (!found) {
                throw new Error('receiver_not found');
            }
            if (updates.organization) {
                const allowedOrgIds = await this.orgApi.findTreeIds(organization);
                if (!allowedOrgIds.some(o => o === updates.organization)) {
                    throw new Error('org_not_allowed');
                }
            }
            const merged = Object.assign({}, {...found }, {...updates}) as ReceiverDTO;
            const entity = this.repository.create(merged);
            const result = await this.repository.save(entity);
            if (!result) {
                throw new Error('receiver_update_failed');
            }
            return result.toDTO();
        } catch (ex) {
            throw new Error(ex.message);
        }
    }

    async delete(id: number): Promise<any> {
        const entity = await this.repository.findOne(id);
        if (!entity) {
            throw new Error('receiver_not_found');
        }
        return this.repository.remove(entity).then(res => res.toDTO());
    }

    async nextId(): Promise<number> {
        const curr =  await this.repository
            .createQueryBuilder('receiver')
            .select('max(receiver.id)')
            .getRawOne();
        return curr ? curr.max + 1 : 1901;
    }

    private async exists(id: number): Promise<boolean> {
        return !!(await this.findOne(id));
    }

    private findOne(id: number): Promise<ReceiverEntity | undefined> {
        return this.repository.findOne(id);
    }
}
