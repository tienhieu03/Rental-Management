import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';


export type ContractDocument = HydratedDocument<Contract>;

@Schema({ timestamps: true })

export class Contract {

    @Prop({type: Object})
    room: {
        _id: mongoose.Schema.Types.ObjectId,
        roomName: string,
        price: number,

    };

    @Prop({type: Object})
    tenant: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string,
        name: string,
        idCard: string,
        phone: string,
        address: string
    }


    @Prop({type: Object})
    innkeeper: {
        _id: mongoose.Schema.Types.ObjectId;
        name: string,
        idCard: string,
        phone: string
    }

    @Prop()
    numberPeople: number
    
    @Prop()
    invoiceDetails:[{
        date: Date,
        months: number
    }]

    @Prop()
    rentCycleCount: number

    @Prop()
    startDate: Date;

    @Prop()
    endDate: Date;

    @Prop()
    depositAmount: number;

    @Prop()
    description: string;

    @Prop()
    address: string;

    @Prop()
    status: string;

    @Prop()
    createdAt: Date;

    @Prop()
    actualEndDate: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
        name: string
    };

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
        name: string
    };

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
        name: string
    };
   

}

export const ContractSchema = SchemaFactory.createForClass(Contract);
