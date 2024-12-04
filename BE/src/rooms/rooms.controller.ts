import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';


@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @ResponseMessage('Create a Room!')
  @Post()
  create(@Body() createRoomDto: CreateRoomDto, @User() user: IUser) {
    return this.roomsService.create(createRoomDto, user);
  }


  @ResponseMessage('Fetch data Rooms with paginate!')
  @Get()
  findAll(
    @Query('currentPage') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string
  ) {
    return this.roomsService.findAll(+currentPage, +pageSize, qs);
  }


  @ResponseMessage('Fetch Room by Id!')
  @Get(':id')
  findByIdRoom(@Param('id') id: string) {
    return this.roomsService.findById(id);
  }

  @ResponseMessage('Update a Room!')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto, @User() user: IUser) {
    return this.roomsService.update(id, updateRoomDto, user);
  }

  @ResponseMessage('Soft-delete a Room!')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.roomsService.remove(id, user);
  }

  
}
