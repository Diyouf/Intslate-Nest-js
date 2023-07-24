import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';

export type teacherDocument = HydratedDocument<teacherSchema>;

@Schema({ collection:'teacher'})
export class teacherSchema {

  @Prop()
  teacherId: number;

  @Prop()
  name: String;

  @Prop()
  gender: String;

  @Prop()
  email: String;

  @Prop()
  phone: Number;

  @Prop({ type: Types.ObjectId, ref: 'subject' })
  subject: ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'classes' })
  class: ObjectId;
  
  @Prop()
  address: String;

  @Prop()
  image: String;

  @Prop()
  password: String;

  @Prop()
  is_classTeacher: boolean;

  @Prop()
  is_delete:boolean

}

export const teacherModel = SchemaFactory.createForClass(teacherSchema);