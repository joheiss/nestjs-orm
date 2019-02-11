import { Controller, Get, Body, Post, Put, Param, Logger, Delete} from '@nestjs/common';
import { ReceiverService } from './receiver.service';
import { ReceiverDTO } from './receiver.dto';

@Controller('api/receivers')
export class ReceiverController {
  constructor(private readonly service: ReceiverService) {}

  @Get()
  getReceivers(): any {
    return this.service.findAll();
  }

  @Post()
  create(@Body() receiver: ReceiverDTO): any {
    return this.service.create(receiver);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updates: Partial<ReceiverDTO>): any {
    const receiver = {id, ...updates} as ReceiverDTO;
    Logger.log(`Receiver to be updated: ${receiver.id}`, 'ReceiverController');
    return this.service.update(receiver);
  }

  @Delete(':id')
  delete(@Param('id') id: string): any {
    return this.service.delete(id);
  }
}
