import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { AuthorizationGuard, Roles } from '../auth';

import { OrganizationDTO } from './organization.dto';
import { OrganizationApiService } from './organization.api.service';
import { ValidationPipe } from '../shared/validation/validation.pipe';
import { OrganizationCreateDTO } from './organization-create.dto';
import { OrganizationUpdateDTO } from './organization-update.dto';

@Controller('api/organizations')
@UseGuards(AuthorizationGuard)
export class OrganizationController {
    constructor(private readonly api: OrganizationApiService) {
    }

    @Get()
    @Roles('admin', 'super')
    getAll(): any {
        return this.api.findAll();
    }

    @Get(':id')
    @Roles('slsusr', 'admin', 'super')
    async getOne(@Param('id') id: string): Promise<any> {
        try {
            return await this.api.findById(id);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
        }
    }

    @Get(':id/tree')
    @Roles('slsusr', 'admin', 'super')
   async getAllByParent(@Param('id') id: string): Promise<any> {
        try {
            return await this.api.findTree(id);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
        }
    }

    @Get(':id/treeids')
    @Roles('slsusr', 'admin', 'super')
    async getAllIdsByParent(@Param('id') id: string): Promise<string[]> {
        try {
            return await this.api.findTreeIds(id);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
        }
    }

    @Post()
    @Roles('admin', 'super')
    @UsePipes(new ValidationPipe())
    async create(@Body() organization: OrganizationCreateDTO): Promise<OrganizationDTO> {
        try {
            return await this.api.create(organization);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Put(':id')
    @Roles('admin', 'super')
    @UsePipes(new ValidationPipe())
    async update(@Param('id') id: string, @Body() updates: Partial<OrganizationUpdateDTO>): Promise<OrganizationDTO> {
        const organization = { id, ...updates } as OrganizationDTO;
        try {
            return await this.api.update(organization);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
        }
    }

    @Delete(':id')
    @Roles('admin', 'super')
    async delete(@Param('id') id: string): Promise<OrganizationDTO> {
        try {
            return await this.api.delete(id);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
        }
    }
}
