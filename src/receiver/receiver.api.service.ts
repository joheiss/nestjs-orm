import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReceiverEntity } from './receiver.entity';
import { ReceiverDTO } from './receiver.dto';
import { ReceiverCreateDTO } from './receiver-create.dto';
import { ReceiverUpdateDTO } from './receiver-update.dto';

@Injectable()
export class ReceiverApiService {
    constructor(
        @InjectRepository(ReceiverEntity)
        private readonly repository: Repository<ReceiverEntity>) {}

    findAll(): Promise<ReceiverDTO[]> {
        return this.repository.find();
    }

    findAllByOrg(orgId: string): Promise<ReceiverDTO[]> {
        return this.repository.find({ where: { organization: orgId }});
    }

   findById(id: number): Promise<any> {
        return this.repository.findOne(id);
    }

    async create(receiver: ReceiverCreateDTO): Promise<ReceiverDTO> {
        const id = await this.nextId();
        const entity = this.repository.create({...receiver, id});
        const result = await this.repository.save(entity);
        if (!result) {
            throw new Error('not_created');
        }
        return result;
    }

    async update(updates: ReceiverUpdateDTO): Promise<ReceiverDTO> {
        const found = await this.repository.findOne(updates.id);
        if (!found) {
            throw new Error('not found');
        }
        const merged = Object.assign({}, {...found }, {...updates}) as ReceiverDTO;
        Logger.log(`merged: ${JSON.stringify(merged)}`, 'ReceiverApiService');
        const entity = this.repository.create(merged);
        return this.repository.save(entity);
    }

    async delete(id: number): Promise<any> {
        const entity = await this.repository.findOne(id);
        if (!entity) {
            throw new Error('not found');
        }
        return this.repository.remove(entity);
    }

    async nextId(): Promise<number> {
        const curr =  await this.repository
            .createQueryBuilder('receiver')
            .select('max(receiver.id)')
            .getRawOne();
        return curr ? curr.max + 1 : 1901;
    }
}
