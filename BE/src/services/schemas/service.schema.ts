import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ServiceDocument = HydratedDocument<Service>;

@Schema({ timestamps: true })
export class Service {
  @Prop()
  serviceName: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  unit: string;

  @Prop()
  type: string;

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

export const ServiceSchema = SchemaFactory.createForClass(Service);
