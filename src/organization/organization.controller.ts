import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UsePipes } from '@nestjs/common';
import { OrganizationDTO } from './organization.dto';
import { OrganizationApiService } from './organization.api.service';
import { ValidationPipe } from '../shared/validation/validation.pipe';
import { OrganizationCreateDTO } from './organization-create.dto';
import { OrganizationUpdateDTO } from './organization-update.dto';

@Controller('api/organizations')
export class OrganizationController {
    constructor(private readonly api: OrganizationApiService) {
    }

    @Get()
    getAll(): any {
        return this.api.findAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: string): Promise<any> {
        const result = await this.api.findById(id);
        if (result) {
            return result;
        } else {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
    }

    @Get(':id/tree')
   async getAllByParent(@Param('id') id: string): Promise<any> {
        try {
            const result = await this.api.findTree(id);
            return result;
        } catch (ex) {
            throw new HttpException(ex.toString(), HttpStatus.NOT_FOUND);
        }
    }

    @Get(':id/treeids')
    async getAllIdsByParent(@Param('id') id: string): Promise<string[]> {
        try {
            const result = await this.api.findTreeIds(id);
            return result;
        } catch (ex) {
            throw new HttpException(ex.toString(), HttpStatus.NOT_FOUND);
        }
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() organization: OrganizationCreateDTO): Promise<OrganizationDTO> {
        try {
            const result = await this.api.create(organization);
            return result;
        } catch (ex) {
            throw new HttpException(ex.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    async update(@Param('id') id: string, @Body() updates: Partial<OrganizationUpdateDTO>): Promise<OrganizationDTO> {
        const organization = { id, ...updates } as OrganizationDTO;
        try {
            const result = await this.api.update(organization);
            return result;
        } catch (ex) {
            throw new HttpException(ex.toString(), HttpStatus.NOT_FOUND);
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<OrganizationDTO> {
        try {
            const result = await this.api.delete(id);
            return result;
        } catch (ex) {
            throw new HttpException(ex.toString(), HttpStatus.NOT_FOUND);
        }
    }
}
