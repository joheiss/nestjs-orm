import { Controller, Get, Body, Post, Put, Param, Logger, Delete } from '@nestjs/common';
import { OrganizationDTO } from './organization.dto';
import { OrganizationApiService } from './organization.api.service';

@Controller('api/organizations')
export class OrganizationController {
    constructor(private readonly api: OrganizationApiService) {
    }

    @Get()
    getAll(): any {
        return this.api.findAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): any {
        return this.api.findById(id);
    }

    @Get(':id/tree')
    getAllByParent(@Param('id') id: string): Promise<any> {
        return this.api.findTree(id);
    }

    @Get(':id/treeids')
    getAllIdsByParent(@Param('id') id: string): Promise<string[]> {
        return this.api.findTreeIds(id);
    }

    @Post()
    create(@Body() organization: OrganizationDTO): any {
        return this.api.create(organization);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updates: Partial<OrganizationDTO>): any {
        const organization = { id, ...updates } as OrganizationDTO;
        Logger.log(`Organization to be updated: ${organization.id}`, 'OrganizationController');
        return this.api.update(organization);
    }

    @Delete(':id')
    delete(@Param('id') id: string): any {
        return this.api.delete(id);
    }
}
