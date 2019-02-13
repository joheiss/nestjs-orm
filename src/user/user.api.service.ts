import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserDTO } from './user.dto';
import { UserCreateDTO } from './user-create.dto';

@Injectable()
export class UserApiService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>) {}

    async findAll(): Promise<UserDTO[]> {
        return this.repository.find().then(res => res.map(u => u.toDTO()));
    }

    async findById(id: string): Promise<UserDTO> {
        const result = await this.repository.findOne(id);
        if (!result) {
            throw new Error('not_found');
        }
        return result.toDTO();
    }

    async findByUsername(username: string): Promise<UserDTO> {
        const result = await this.repository.findOne({ where: { username }});
        if (!result) {
            throw new Error('not_found');
        }
        return result.toDTO();
    }

    async create(user: UserCreateDTO): Promise<UserDTO> {
        const found = await this.repository.findOne({ where: { username: user.username}});
        if (found) {
            throw new Error('already_exists');
        }
        const entity = this.repository.create(user);
        const result = await this.repository.save(entity);
        if (!result) {
            throw new Error('not_created');
        }
        return result.toDTO();
    }

    async delete(username: string): Promise<any> {
        const entity = await this.repository.findOne({ where: { username }});
        if (!entity) {
            throw new Error('not found');
        }
        return this.repository.remove(entity)
            .then(res => res.toDTO());
    }

    async login(user: UserCreateDTO): Promise<UserDTO> {
        const found = await this.repository.findOne({ where: { username: user.username }});
        if (!found) {
            throw new Error('not found');
        }
        const valid = await found.isPasswordValid(user.password);
        if (!valid) {
            throw new Error('invalid user/password');
        }
        return found.toDTO(true);
    }
}
