import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';
import { emit } from 'process';

@Injectable()
export class PermissionService {
  constructor(@InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>) { }

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    let {apiPath, method} = createPermissionDto;
    const isExist = await this.permissionModel.findOne({apiPath, method, isDeleted: false});
    if(isExist){
      throw new BadRequestException(`Permission with apiPath = ${apiPath}, method = ${method} is exist`);
    }
    let permission = await this.permissionModel.create({...createPermissionDto, 
      createdBy: {
      _id: user._id,
      email: user.email
      }
    }) ;

    return {
      _id: permission._id,
      createdAt: permission.createdAt
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let defaultCurrentPage = currentPage ? currentPage : 1;
    let defaultLimit = limit ? limit : 10;
    let skip = (defaultCurrentPage - 1) * limit;
    const totalItem = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItem / defaultLimit)
    let result = await this.permissionModel.find(filter)
      .skip(skip)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec()
      ;

    return  {
      meta: {
        current: defaultCurrentPage,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItem
      },
      result
    };
  }

  async findOne(id: string) {
    return await this.permissionModel.find({_id: id});
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {

    return this.permissionModel.updateOne({_id: id}, {
      ...updatePermissionDto, 
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async remove(id: string, user: IUser) {
    await this.permissionModel.updateOne({_id: id},{
      deletedBy:{
        _id: user._id,
        email: user.email
      }
    })
    return await this.permissionModel.softDelete({_id: id});
  }
}
