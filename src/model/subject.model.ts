import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type subjectDocument = HydratedDocument<subjectSchema>;

@Schema({ collection: 'subject' })
export class subjectSchema {
  @Prop()
  subjectName: string;

  @Prop({ default: 0 })
  teacherCount: number;
}

export const subjectModel = SchemaFactory.createForClass(subjectSchema);
