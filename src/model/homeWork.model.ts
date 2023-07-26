import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types} from 'mongoose';

export type homeWorkDocument = HydratedDocument<homeWorkSchema>;

@Schema({ collection:'homework'})
export class homeWorkSchema {

  @Prop()
  dueDate: Date;

  @Prop()
  homework: String;

  @Prop()
  date: Date;

  @Prop({type:Types.ObjectId,ref:'teacher'})
  teacher: ObjectId;
  
  @Prop({type:Types.ObjectId,ref:'classes'})
  class:ObjectId;

  

}

export const homeWorkModel = SchemaFactory.createForClass(homeWorkSchema);