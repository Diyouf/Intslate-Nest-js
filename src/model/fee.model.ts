import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

@Schema({ collection: 'fee' })
export class Fee extends Document {
    @Prop({ type: Types.ObjectId, ref: 'student', })
    student: ObjectId;

    @Prop({
        type: {
            amount: { type: Number, default: 0 },
            status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
            paymentDate: { type: Date },
            paymentId: { type: String }
        },
        default: {},
    })
    term1: {
        amount: number;
        status: 'Paid' | 'Unpaid';
        paymentDate: Date
        paymentId: string
    };

    @Prop({
        type: {
            amount: { type: Number, default: 0 },
            status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
            paymentDate: { type: Date },
            paymentId: { type: String }
        },
        default: {},
    })
    term2: {
        amount: number;
        status: 'Paid' | 'Unpaid';
        paymentDate: Date,
        paymentId: string
    };

    @Prop({
        type: {
            amount: { type: Number, default: 0 },
            status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
            paymentDate: { type: Date },
            paymentId: { type: String }
        },
        default: {},
    })
    term3: {
        amount: number;
        status: 'Paid' | 'Unpaid';
        paymentDate: Date,
        paymentId: string
    };
}

export const FeeSchema = SchemaFactory.createForClass(Fee);
