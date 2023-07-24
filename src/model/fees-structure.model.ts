import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'fee-Structure' })
export class FeeStructure extends Document {

    @Prop({
        type: {
            amount: { type: Number, default: 0 }
        }
    })
    term1: {
        amount: number;
    };

    @Prop({
        type: {
            amount: { type: Number, default: 0 },
           },
    })
    term2: {
        amount: number;
    };

    @Prop({
        type: {
            amount: { type: Number, default: 0 },
            },
    })
    term3: {
        amount: number;
       
    };
}

export const FeeStructureSchema = SchemaFactory.createForClass(FeeStructure);
