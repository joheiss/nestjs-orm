import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Param,
    Post,
    Put,
    UsePipes,
} from '@nestjs/common';
import { ReceiverApiService } from './receiver.api.service';
import { ReceiverDTO } from './receiver.dto';
import { ValidationPipe } from '../shared/validation/validation.pipe';
import { ReceiverCreateDTO } from './receiver-create.dto';
import { ReceiverUpdateDTO } from './receiver-update.dto';

@Controller('api/receivers')
export class ReceiverController {
    constructor(private readonly api: ReceiverApiService) {
    }

    @Get()
    getAll(): any {
        return this.api.findAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: number): Promise<ReceiverDTO> {
       const result = await this.api.findById(id);
       if (!result) {
           throw new HttpException('Not found', HttpStatus.NOT_FOUND);
       }
       return result;
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() receiver: ReceiverCreateDTO): Promise<ReceiverDTO> {
        try {
            const result = await this.api.create(receiver);
            return result;
        } catch (ex) {
            throw new HttpException(ex.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    async update(
        @Param('id') id: string,
        @Body() updates: Partial<ReceiverUpdateDTO>
    ): Promise<ReceiverDTO> {

        const receiver = { id: +id, ...updates } as ReceiverUpdateDTO;
        Logger.log(`update: ${JSON.stringify(receiver)}`, 'ReceiverController');
        try {
            const result = await this.api.update(receiver);
            return result;
        } catch (ex) {
            throw new HttpException(ex.toString(), HttpStatus.NOT_FOUND);
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<ReceiverDTO> {
        try {
            const result = await this.api.delete(+id);
            return result;
        } catch (ex) {
            throw new HttpException(ex.toString(), HttpStatus.NOT_FOUND);
        }
    }
}
