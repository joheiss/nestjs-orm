import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { Auth, AuthorizationGuard, Roles } from '../auth';
import { ValidationPipe } from '../shared/validation/validation.pipe';

import { ReceiverApiService } from './receiver.api.service';
import { ReceiverDTO } from './receiver.dto';
import { ReceiverCreateDTO } from './receiver-create.dto';
import { ReceiverUpdateDTO } from './receiver-update.dto';

@Controller('api/receivers')
@UseGuards(AuthorizationGuard)
@Roles('slsusr', 'admin', 'super')
export class ReceiverController {

    constructor(private readonly api: ReceiverApiService) { }

    @Get()
    getAll(@Auth() auth: any): any {
        Logger.log(`Auth: ${JSON.stringify(auth)}`, 'ReceiverController');
        return this.api.findAllByOrg(auth.organization);
    }

    @Get(':id')
    async getOne(@Auth() auth: any, @Param('id') id: number): Promise<ReceiverDTO> {
        Logger.log(`Auth: ${JSON.stringify(auth)}`, 'ReceiverController');
        try {
            return await this.api.findByIdAndOrg(id, auth.organization);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
        }
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Auth() auth: any, @Body() receiver: ReceiverCreateDTO): Promise<ReceiverDTO> {
        try {
            return await this.api.createWithOrg(receiver, auth.organization);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    async update(
        @Auth() auth: any,
        @Param('id') id: string,
        @Body() updates: Partial<ReceiverUpdateDTO>,
    ): Promise<ReceiverDTO> {

        const receiver = { id: +id, ...updates } as ReceiverUpdateDTO;
        Logger.log(`update: ${JSON.stringify(receiver)}`, 'ReceiverController');
        try {
            return await this.api.updateWithOrg(receiver, auth.organization);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<ReceiverDTO> {
        try {
            return await this.api.delete(+id);
        } catch (ex) {
            throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
        }
    }
}
