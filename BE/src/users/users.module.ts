import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Role, RoleSchema } from 'src/role/schemas/role.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
  MongooseModule.forFeature([{name: Role.name, schema: RoleSchema}])
],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, UsersModule]
})
export class UsersModule {}
