import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service, ServiceDocument } from './schemas/service.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/user.interface';
import mongoose from 'mongoose';
import { use } from 'passport';
import aqp from 'api-query-params';

@Injectable()
export class ServicesService {
  constructor(@InjectModel(Service.name) private serviceModel: SoftDeleteModel<ServiceDocument>) { }


  async create(createServiceDto: CreateServiceDto, user: IUser) {
    const isExist = await this.serviceModel.findOne({serviceName: createServiceDto.serviceName});
    if(isExist){
      throw new BadRequestException('Service name already existed!');
    }
    const service = await this.serviceModel.create({...createServiceDto,
      createdBy: {
        _id: user._id,
        email: user.email,
        name: user.name
      }
    })
    return {
      _id: service._id,
      createdAt: service.createdAt
    };
  }

  async findAll(currentPage: number, pageSize: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.currentPage;
    delete filter.pageSize;
    const defaultCurrentPage = currentPage ? currentPage : 1;
    const defaultPageSize = pageSize ? pageSize : 5;
    const totalDocument = (await this.serviceModel.find(filter)).length;
    let totalPage = Math.ceil(totalDocument / defaultPageSize);
    let skip = (defaultCurrentPage - 1) * pageSize;


    const result = await this.serviceModel.find(filter)
      .skip(skip)
      .limit(defaultPageSize)
      .sort(sort as any)
      .select(projection)
      .populate(population)
      .exec()

    return {
      meta: {
        currentPage: defaultCurrentPage,
        pageSize: defaultPageSize,
        totalPage: totalPage,
        totalDocument: totalDocument
      },
      result
    }

  }

  async findOne(id: string) {
    if(!mongoose.isValidObjectId(id)){
      throw new BadRequestException('Id Room is not valid!')
    }
    return await this.serviceModel.findOne({_id: id}); ;
  }
  async findOtherService(id: string) {
    if(!mongoose.isValidObjectId(id)){
      throw new BadRequestException('Id Room is not valid!')
    }
    return await this.serviceModel.findOne({_id: id}); ;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto, user: IUser
  ) {
    if(!mongoose.isValidObjectId(id)){
      throw new BadRequestException('Id Room is not valid!')
    }
   
    return await this.serviceModel.updateOne({_id: id}, {
      ...updateServiceDto, updatedBy: {
        _id: user._id,
        email: user.email,
        name: user.name
      }
    });
  }

  async remove(id: string, user: IUser) {
    if(!mongoose.isValidObjectId(id)){
      throw new BadRequestException('Id Room is not valid!')
    }
    await this.serviceModel.updateOne({_id: id},
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
          name: user.name
        }
      }
    )

    return await this.serviceModel.softDelete({_id: id});
  }
}
