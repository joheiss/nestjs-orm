import { Injectable, Logger } from '@nestjs/common';
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
        return await this.repository.find()
            .then(res => {
                Logger.log(`${JSON.stringify(res)}`, 'OrganizationApiService');
                return res;
            })
            .then(res => res.map(o => o.toDTO()));
    }

    async findById(id: string): Promise<OrganizationDTO> {
        const result = await this.repository.findOne(id);
        if (!result) {
            throw new Error('org_not_found');
        }
        return result.toDTO();
    }

    async findTree(parent: string): Promise<any> {
        const root = await this.repository.findOne(parent);
        if (!root) {
            throw new Error('org_root_not_found');
        }
        return await this.repository.manager
            .getTreeRepository(OrganizationEntity)
            .findDescendantsTree(root)
            .then(res => res.toDTO(true));
    }

    async findTreeIds(parent: string): Promise<string[]> {
        const root = await this.repository.findOne(parent);
        const orgIds: string[] = [];
        if (!root) {
            throw new Error('org_root_not_found');
        }
        const tree = await this.repository.manager
            .getTreeRepository(OrganizationEntity)
            .findDescendantsTree(root);
        if (!tree) {
            throw new Error('org_tree_not_found');
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
                throw new Error('org_parent_not_found');
            }
            entity.parent = parent;
        }
        const result = await this.repository.save(entity);
        if (!result) {
            throw new Error('org_create_failed');
        }
        return result.toDTO();
    }

    async update(updates: OrganizationUpdateDTO): Promise<OrganizationDTO> {
        const found = await this.repository.findOne(updates.id);
        if (!found) {
            throw new Error('org_not_found');
        }
        const merged = Object.assign({}, {...found}, {...updates});
        const entity = this.repository.create(merged);
        const result = await this.repository.save(entity);
        if (!result) {
            throw new Error('org_update_failed');
        }
        return result.toDTO();
    }

    async delete(id: string): Promise<OrganizationDTO> {
        const entity = await this.repository.findOne(id);
        if (!entity) {
            throw new Error('org_not_found');
        }
        return this.repository.remove(entity).then(res => res.toDTO());
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
