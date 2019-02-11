import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReceiverEntity } from './receiver.entity';
import { ReceiverDTO } from './receiver.dto';

@Injectable()
export class ReceiverService {
    constructor(
        @InjectRepository(ReceiverEntity)
        private readonly repository: Repository<ReceiverEntity>) {}

    async findAll(): Promise<ReceiverDTO[]> {
        return await this.repository.find();
    }

    async create(receiver: ReceiverDTO): Promise<ReceiverDTO> {
        const entity = this.repository.create(receiver);
        return this.repository.save(entity);
    }

    async update(receiver: ReceiverDTO): Promise<ReceiverDTO> {
        const entity = this.repository.create(receiver);
        return this.repository.save(entity);
    }

    async delete(id: string): Promise<any> {
        const entity = await this.repository.findOne(id);
        if (!entity) {
            return undefined;
        }
        return this.repository.remove(entity);
    }
}
