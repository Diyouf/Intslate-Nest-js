import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { EventDocument } from '../model/event.model';


@Controller('user')
export class UserController {
    constructor(private service:UserService){}


    @Get('loadEvents')
    async loadEvents():Promise<EventDocument[]>{
        return await this.service.loadAllEvents()
    }



}
