import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RegisterServiceService } from './register-service.service';
import { CreateRegisterServiceDto } from './dto/create-register-service.dto';
import { UpdateRegisterServiceDto } from './dto/update-register-service.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('register-service')
export class RegisterServiceController {
  constructor(
    private readonly registerServiceService: RegisterServiceService
  ) { }

  @ResponseMessage('Register Service for Room!')
  @Post()
  create(@Body() createRegisterServiceDto: CreateRegisterServiceDto, @User() user: IUser) {
    return this.registerServiceService.create(createRegisterServiceDto, user);
  }

  @ResponseMessage('Fetch data Register Service with paginate!')
  @Get()
  findAll(
    @Query('currentPage') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string
  ) {
    return this.registerServiceService.findAll(+currentPage, +pageSize, qs);
  }

  @ResponseMessage('Fetch data a Register Service for Room!')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registerServiceService.findOne(id);
  }

  @ResponseMessage('Update status register!')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegisterServiceDto: UpdateRegisterServiceDto, @User() user: IUser) {
    return this.registerServiceService.update(id, updateRegisterServiceDto, user);
  }

  @ResponseMessage('Soft delete register!')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.registerServiceService.remove(id, user);
  }
}
