import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';

export type attendanceDocument = HydratedDocument<attendanceSchema>;

@Schema({ collection: 'attendance' })
export class attendanceSchema {
  @Prop({ type: Types.ObjectId, ref: 'classes' })
  class: ObjectId;

  @Prop()
  date: Date;

  @Prop([
    {
      studentId: { type: Types.ObjectId, ref: 'student' },
      attendance: { type: String ,enum:['present','absent']},
    },
  ])
  attendance: {
    studentId: Types.ObjectId;
    attendance: string;
  }[];
}

export const attendanceModel = SchemaFactory.createForClass(attendanceSchema);
