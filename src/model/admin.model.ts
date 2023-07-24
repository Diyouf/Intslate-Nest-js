import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type adminDocument = HydratedDocument<adminSchema>;

@Schema({ collection:'admin'})
export class adminSchema {
  @Prop()
  email: String;

  @Prop()
  password: String;
}

export const AdminSchema = SchemaFactory.createForClass(adminSchema);




