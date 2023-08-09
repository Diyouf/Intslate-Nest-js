import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'connections' })
export class ConnectionSchema {
  @Prop({
    type: {
      student: { type: Types.ObjectId, ref: 'student' },
      teacher: { type: Types.ObjectId, ref: 'teacher' },
    },
  })
  connection: {
    student: string;
    teacher: string;
  };
}

export type ConnectionDocument = ConnectionSchema & Document;

export const ConnectionModel = SchemaFactory.createForClass(ConnectionSchema);
