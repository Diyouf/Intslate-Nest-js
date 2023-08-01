import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument} from 'mongoose';

export type EventDocument = HydratedDocument<EventSchema>;

@Schema({ collection:'events'})
export class EventSchema {

  @Prop()
  date: Date;

  @Prop()
  title: String;

  @Prop()
  description: String;

  @Prop()
  avenue: String;

  @Prop()
  image: String;

  @Prop()
  ConductingDate: Date;

}

export const EventModel = SchemaFactory.createForClass(EventSchema);