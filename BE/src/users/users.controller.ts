import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose from 'mongoose';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  
  @ResponseMessage('Create a new user by Admin')
  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @User() user: IUser
  ) {
      return this.usersService.create(createUserDto ,user);
  }

  @Get()
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string
  ) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    if(!mongoose.Types.ObjectId.isValid(id))
      return "not found user"
    return this.usersService.findOne(id);
   
  }


  @Patch(':id')
  @ResponseMessage('Update a new user')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.usersService.update(id, updateUserDto, user);
  }

 
  @Delete(':id')
  @ResponseMessage('Soft-delete a new user')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }

  @ResponseMessage('New password updated successfully!')
  @Post('/change-password')
  changePassword(
    @Body('_id') id: string,
    @Body('password') password: string,
    @Body('oldPassword') oldPassword: string,
    
  ) {
      return this.usersService.changePassword(id, password, oldPassword);
  }
}
