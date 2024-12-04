import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @ResponseMessage('Create a Service!')
  @Post()
  create(@Body() createServiceDto: CreateServiceDto, @User() user: IUser) {
    return this.servicesService.create(createServiceDto, user);
  }

  @ResponseMessage('Get data Services with paginate!')
  @Get()
  findAll(
    @Query('currentPage') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string
  ) {
    return this.servicesService.findAll(+currentPage, +pageSize, qs);
  }

  @ResponseMessage('Get a Service by Id!')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @ResponseMessage('Update a Service!')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto,@User() user: IUser) {
    return this.servicesService.update(id, updateServiceDto, user);
  }

  @ResponseMessage('Soft-delete a Service!')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.servicesService.remove(id, user);
  }
}
