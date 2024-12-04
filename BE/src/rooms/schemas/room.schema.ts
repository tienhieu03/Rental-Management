import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Service } from 'src/services/schemas/service.schema';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room {
  @Prop()
  roomName: string;

  @Prop()
  type: string;

  @Prop()
  status: string;

  @Prop()
  area: number;

  @Prop()
  price: number;

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.Array, ref: Service.name })
  services : mongoose.Schema.Types.ObjectId[] ;

  @Prop({ type: mongoose.Schema.Types.Array, ref: Service.name })
  regisServices : mongoose.Schema.Types.ObjectId[] 

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

export const RoomSchema = SchemaFactory.createForClass(Room);
