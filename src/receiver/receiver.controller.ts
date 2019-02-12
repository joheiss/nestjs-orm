import { Controller, Get, Body, Post, Put, Param, Logger, Delete } from '@nestjs/common';
import { ReceiverApiService } from './receiver.api.service';
import { ReceiverDTO } from './receiver.dto';

@Controller('api/receivers')
export class ReceiverController {
    constructor(private readonly api: ReceiverApiService) {
    }

    @Get()
    getAll(): any {
        return this.api.findAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): any {
        if (id === 'nextid') {
            return this.api.nextId();
        }
        return this.api.findById(+id);
    }

    @Post()
    create(@Body() receiver: ReceiverDTO): any {
        return this.api.create(receiver);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() updates: Partial<ReceiverDTO>): any {
        const receiver = { id, ...updates } as ReceiverDTO;
        Logger.log(`Receiver to be updated: ${receiver.id}`, 'ReceiverController');
        return this.api.update(receiver);
    }

    @Delete(':id')
    delete(@Param('id') id: number): any {
        return this.api.delete(id);
    }
}
