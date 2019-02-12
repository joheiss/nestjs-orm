import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReceiverEntity } from './receiver.entity';
import { ReceiverDTO } from './receiver.dto';

@Injectable()
export class ReceiverApiService {
    constructor(
        @InjectRepository(ReceiverEntity)
        private readonly repository: Repository<ReceiverEntity>) {}

    async findAll(): Promise<ReceiverDTO[]> {
        return await this.repository.find();
    }

    async findAllByOrg(orgId: string): Promise<ReceiverDTO[]> {
        return await this.repository.find({ where: { organization: orgId }});
    }

    async findById(id: number): Promise<any> {
        return await this.repository.findOne(id);
    }

    async create(receiver: ReceiverDTO): Promise<ReceiverDTO> {
        const id = await this.nextId();
        const entity = this.repository.create({...receiver, id});
        return this.repository.save(entity);
    }

    async update(receiver: ReceiverDTO): Promise<ReceiverDTO> {
        const found = await this.repository.findOne(receiver.id);
        if (!found) {
            throw new Error('not found');
        }
        const entity = this.repository.create(receiver);
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
        Logger.log(`Last used receiver id: ${curr.max}`, 'ReceiverService');
        return curr ? curr.max + 1 : 1901;
    }
}
