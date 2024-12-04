import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @ResponseMessage('Create a Contract!')
  @Post()
  create(@Body() createContractDto: CreateContractDto, @User() user: IUser) {
    return this.contractsService.create(createContractDto, user);
  }

  @ResponseMessage('Fetch data Contracts with paginate!')
  @Get()
  findAll(
    @Query('currentPage') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string
  ) {
    return this.contractsService.findAll(+currentPage, +pageSize, qs);
  }

  @ResponseMessage('Fetch data Contracts by Tenant!')
  @Post("/by-tenant/:id")
  findAllByTenant(@Body('id') id: string) {
    return this.contractsService.findByTenantId(id);
  }

 
  @ResponseMessage('Update a Contract!')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto, @User() user: IUser) {
    return this.contractsService.update(id, updateContractDto, user);
  }

  @ResponseMessage('Soft-delete a Contract!')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.contractsService.remove(id, user);
  }

  @Public()
  @ResponseMessage('Fetch data Contracts by Tenant!')
  @Post("/expire/:id")
  expire(@Param('id') id: string) {
    return this.contractsService.findByTenantIdAndContractActive(id);
  }
}
