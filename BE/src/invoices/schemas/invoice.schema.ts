import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Room, RoomSchema } from 'src/rooms/schemas/room.schema';
import { Service, ServiceSchema } from 'src/services/schemas/service.schema';
import { User } from 'src/users/schemas/user.schema';


export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ timestamps: true })
export class Invoice {

    @Prop({ type: Object })
    room: {
        _id: mongoose.Schema.Types.ObjectId,
        roomName: string,
        price: number,

    };

    @Prop({ type: Object })
    tenant: {
        _id: mongoose.Schema.Types.ObjectId;
        name: string,
        idCard: string,
        phone: string
    }

    @Prop({ type: Object })
    service: {
        _id: mongoose.Schema.Types.ObjectId;
        name: string,
        unit: string,
        priceUnit: number;

    }
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Service.name })
    serviceId: mongoose.Schema.Types.ObjectId

    @Prop()
    firstIndex: number;

    @Prop()
    finalIndex: number;

    @Prop()
    totalNumber: number;

    @Prop()
    month: string;
 
    @Prop()
    send: boolean;

    @Prop()
    invoiceDate: Date;

    @Prop()
    description: string;

    @Prop()
    amount: number;

    @Prop()
    status: string;

  

    @Prop()
    createdAt: Date;

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
    };

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
