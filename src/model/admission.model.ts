import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types} from 'mongoose';

export type studentDocument = HydratedDocument<studentSchema>;

@Schema({ collection:'student'})
export class studentSchema {

  @Prop()
  studentId: number;

  @Prop()
  name: String;

  @Prop()
  email: String;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  phone: Number;

  @Prop()
  DOB: String;

  @Prop()
  seekingClass: string;

  @Prop()
  Guardname: String;

  @Prop()
  relation: String;

  @Prop()
  city: String;
  
  @Prop()
  address: String;

  @Prop()
  image: String;

  @Prop()
  password: String;

  @Prop()
  state: String;

  @Prop()
  zip: Number;

  @Prop()
  is_approved:string;

  @Prop()
  admissoinDate:Date;
  
  @Prop({type:Types.ObjectId,ref:'classes'})
  class:ObjectId;

}

export const studentModel = SchemaFactory.createForClass(studentSchema);