import { InjectModel } from '@nestjs/mongoose';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Server ,Socket} from 'socket.io';
import { ChatDocument } from '../../../model/chat.model';
import { Types } from 'mongoose';
import { Message } from '../chat.interfaces';


@WebSocketGateway({cors:{origin:['http://localhost:4200'] }})
export class ChatGateway implements OnGatewayConnection,OnGatewayDisconnect{

  constructor(
    @InjectModel('chats')
    private readonly chatModel: Model<ChatDocument>,
    ){}

  @WebSocketServer()
  server:Server

  handleDisconnect() {
  }
  handleConnection() {   
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(socket:Socket,message:Message){
    // const connectionFind = await this.connectionModel.findById({_id:message.connectionId})
   
    
    
    const newChat = new this.chatModel({
      connection:message.connectionId,
      from:message.senderName,
      to:new Types.ObjectId(message.to._id),
      date:new Date(),
      content:message.message
      
    });

    const savedChat = await newChat.save();

    this.server.emit('newMessages',message)
  }
}
