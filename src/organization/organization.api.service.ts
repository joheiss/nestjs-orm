import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { OrganizationDTO } from './organization.dto';

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
        return await this.repository.findOne(id);
    }

    async findTree(parent: string): Promise<any> {
        const root = await this.repository.findOne(parent);
        if (!root) {
            return {};
        }
        return await this.repository.manager
            .getTreeRepository(OrganizationEntity)
            .findDescendantsTree(root);
    }

    async findTreeIds(parent: string): Promise<string[]> {
        const root = await this.repository.findOne(parent);
        const orgIds: string[] = [];
        if (!root) {
            return orgIds;
        }
        const tree = await this.repository.manager
            .getTreeRepository(OrganizationEntity)
            .findDescendantsTree(root);
        if (!tree) {
            return orgIds;
        }
        return this.flattenTree(orgIds, tree);
    }

    async create(organization: OrganizationDTO): Promise<OrganizationDTO> {
        const { parentId } = organization;
        delete organization.parentId;
        const entity = this.repository.create(organization);
        if (parentId) {
            const parent = await this.repository.findOne(organization.parentId);
            if (!parent) {
                throw new Error('parent_not_found');
            }
            entity.parent = parent;
        }
        return this.repository.manager.save(entity);
    }

    async update(organization: OrganizationDTO): Promise<OrganizationDTO> {
        const found = await this.repository.findOne(organization.id);
        if (!found) {
            throw new Error('not_found');
        }
        const entity = this.repository.create(organization);
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

    private flattenTreeToIds(result: string[], tree: any): string[] {
        if (tree.id) {
            result.push(tree.id);
        }
        if (tree.children) {
            tree.children.forEach((child: any) => this.flattenTreeToIds(result, child));
        }
        return result;
    }
}
