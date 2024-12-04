import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Room } from 'src/rooms/schemas/room.schema';
import { Service } from 'src/services/schemas/service.schema';
import { User } from 'src/users/schemas/user.schema';


export type RegisterServiceDocument = HydratedDocument<RegisterService>;

@Schema({ timestamps: true })
export class RegisterService {
    
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Service.name })
  service: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Room.name })
  room: mongoose.Schema.Types.ObjectId;

  @Prop()
  status: string;

  @Prop()
  type: boolean;
  //1: add, 0: cancel

  @Prop()
  executeNow: boolean;
  //1: now, 0: nextMonth

  @Prop()
  implementationDate: string;


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

export const RegisterServiceSchema = SchemaFactory.createForClass(RegisterService);
