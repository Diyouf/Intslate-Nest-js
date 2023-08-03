import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModel } from '../model/event.model';

@Module({
  imports:[
    MongooseModule.forFeature(
      [
        { name: 'events', schema: EventModel },
        
      ]),
  ],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {

}
