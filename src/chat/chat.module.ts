import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModel } from '../model/chat.model';
import { ConnectionModel } from '../model/connection.model';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
         { name: 'chats', schema: ChatModel },
         { name: 'connections', schema: ConnectionModel },
    ]
    )],
  providers: [ChatGateway]
})
export class ChatModule {}
