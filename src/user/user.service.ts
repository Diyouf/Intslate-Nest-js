import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDocument } from 'src/model/event.model';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('events') private readonly eventModel: Model<EventDocument>,
        
    ){}

    async loadAllEvents(){
        try {
            const eventData = <EventDocument[]> await this.eventModel.find({is_active:true}).sort({date:-1})
            if(eventData){
                return eventData
            }
        } catch (error) {
            console.log(error);
            
        }
    }
}
