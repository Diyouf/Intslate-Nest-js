import { ObjectId } from "mongoose"

export interface addEvent {
    title:String,
    description:String
    image:File
    date:Date
    avenue:String
}

export interface loadEvent {
    _id?: string | ObjectId; // Use `string | ObjectId` for the _id property
    title: string;
    description: string;
    image: string;
    date: Date;
    avenue: string;
    ConductingDate: Date;
  }
  

