import { Module } from '@nestjs/common';
import { RegisterServiceService } from './register-service.service';
import { RegisterServiceController } from './register-service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RegisterService, RegisterServiceSchema } from './schemas/register-service.schema';
import { Room, RoomSchema } from 'src/rooms/schemas/room.schema';
import { Contract, ContractSchema } from 'src/contracts/schemas/contract.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: RegisterService.name, schema: RegisterServiceSchema}]),
  MongooseModule.forFeature([{name: Room.name, schema: RoomSchema}]),
  MongooseModule.forFeature([{name: Contract.name, schema: ContractSchema}])
],
  
  controllers: [RegisterServiceController],
  providers: [RegisterServiceService],
  exports: [RegisterServiceService]
})
export class RegisterServiceModule {}
