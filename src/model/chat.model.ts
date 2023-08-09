import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

@Schema({ collection: 'chats' })
export class ChatSchema {
  @Prop({ type: Types.ObjectId, ref: 'connections', required: true })
  connection: ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'student', required: true })
  from: ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'teacher', required: true })
  to: ObjectId;

  @Prop({ required: true })
  date: Date;


  @Prop({ required: true })
  content: string;
}

export type ChatDocument = ChatSchema & Document;

export const ChatModel = SchemaFactory.createForClass(ChatSchema);
