import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/user.interface';
import { ResponseMessage, User } from 'src/decorator/customize';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ResponseMessage('Create a Role!')
  create(@Body() createRoleDto: CreateRoleDto,@User() user: IUser) {
    return this.roleService.create(createRoleDto, user);
  }

  @ResponseMessage("Fetch data a Role with paginate!")
  @Get()
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,

  ) {
    return this.roleService.findAll(+currentPage, +pageSize, qs);
  }

  @ResponseMessage("Fetch data a Role!")
  @Post(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @ResponseMessage("Updated a Role!")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: IUser) {
    return this.roleService.update(id, updateRoleDto, user);
  }

  @ResponseMessage("Soft-delete a Role!")
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.roleService.remove(id, user);
  }
}
