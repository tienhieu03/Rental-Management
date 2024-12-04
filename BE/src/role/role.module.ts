import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role, RoleSchema } from './schemas/role.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{name: Role.name, schema: RoleSchema}])],
  exports:[RoleService],
  controllers: [RoleController],
  providers: [RoleService]
})
export class RoleModule {}
