import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { OrganizationDTO } from './organization.dto';
import { OrganizationUpdateDTO } from './organization-update.dto';
import { OrganizationCreateDTO } from './organization-create.dto';

@Injectable()
export class OrganizationApiService {
    constructor(
        @InjectRepository(OrganizationEntity)
        private readonly repository: Repository<OrganizationEntity>) {
    }

    async findAll(): Promise<OrganizationDTO[]> {
        return await this.repository.find();
    }

    async findById(id: string): Promise<any> {
        return this.repository.findOne(id);
    }

    async findTree(parent: string): Promise<any> {
        const root = await this.repository.findOne(parent);
        if (!root) {
            throw new Error('root_not_found');
        }
        return await this.repository.manager
            .getTreeRepository(OrganizationEntity)
            .findDescendantsTree(root);
    }

    async findTreeIds(parent: string): Promise<string[]> {
        const root = await this.repository.findOne(parent);
        const orgIds: string[] = [];
        if (!root) {
            throw new Error('root_not_found');
        }
        const tree = await this.repository.manager
            .getTreeRepository(OrganizationEntity)
            .findDescendantsTree(root);
        if (!tree) {
            throw new Error('not_found');
        }
        return this.flattenTree(orgIds, tree);
    }

    async create(organization: OrganizationCreateDTO): Promise<OrganizationDTO> {
        const { parentId } = organization;
        delete organization.parentId;
        const entity = this.repository.create(organization);
        if (parentId) {
            const parent = await this.repository.findOne(parentId);
            if (!parent) {
                throw new Error('parent_not_found');
            }
            entity.parent = parent;
        }
        return this.repository.save(entity);
    }

    async update(updates: OrganizationUpdateDTO): Promise<OrganizationDTO> {
        const found = await this.repository.findOne(updates.id);
        if (!found) {
            throw new Error('not_found');
        }
        const merged = Object.assign({}, {...found}, {...updates});
        const entity = this.repository.create(merged);
        return this.repository.save(entity);
    }

    async delete(id: string): Promise<OrganizationDTO> {
        const entity = await this.repository.findOne(id);
        if (!entity) {
            throw new Error('not_found');
        }
        return this.repository.remove(entity);
    }

    private flattenTree(result: string[], tree: any): string[] {
        if (tree) {
            result.push(tree.id);
        }
        if (tree.children) {
            tree.children.forEach((child: any) => this.flattenTree(result, child));
        }
        return result;
    }
}
