import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';

export type classDocument = HydratedDocument<classSchema>;

@Schema({ collection: 'classes' })
export class classSchema {
  @Prop()
  className: number;

  @Prop()
  division: string;

  @Prop({default: 0 })
  students: number;

  @Prop()
  maxStudent: number;

  @Prop({ type: Types.ObjectId, ref: 'teacher' })
  classTeacher: ObjectId;


}

export const classModel = SchemaFactory.createForClass(classSchema);
