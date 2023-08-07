import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types} from 'mongoose';

export type leaveReqDocument = HydratedDocument<leaveReqSchema>;

@Schema({ collection:'leaveReq'})
export class leaveReqSchema {

  @Prop()
  noofday: number;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  currentDate: Date;

  @Prop()
  reason: string;

  @Prop({type:Types.ObjectId,ref:'student'})
  student: ObjectId;
  
  @Prop({type:Types.ObjectId,ref:'classes'})
  class:ObjectId;

  @Prop({type: String, enum: ['Pending', 'Aproved', 'Rejected'], default: 'Pending' })
  status: string;

  

}

export const leaveReqModel = SchemaFactory.createForClass(leaveReqSchema);