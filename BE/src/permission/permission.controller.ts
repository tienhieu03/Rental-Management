import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ResponseMessage('Successfully created permissions')
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto, @User() user: IUser) {
    return this.permissionService.create(createPermissionDto, user);
  }

  @Get()
  @ResponseMessage('Fetch Permission with paginate!')
  findAll(
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
    @Query() qs: string,
  ) {
    return this.permissionService.findAll(+current, +pageSize, qs);
  }

  @ResponseMessage('Fetch Permission with id!')
  @Post(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @ResponseMessage('Updated successfully!')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @User() user: IUser) {
    return this.permissionService.update(id, updatePermissionDto, user);
  }

  @ResponseMessage('Deleted a Permission successfully!')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.permissionService.remove(id, user);
  }
}
