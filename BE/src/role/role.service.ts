import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/user.interface';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { ADMIN_ROLE } from '../databases/sample';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>) { }

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    let name = createRoleDto.name;
    let isExist = await this.roleModel.findOne({name});
    
    if(isExist){
      throw new BadRequestException(`Name ${createRoleDto.name} is exist`);
    }
    let role = await this.roleModel.create({...createRoleDto, 
      createdBy:{
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: role._id,
      createdAt: role.createdAt,
    } ;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let defaultCurrent = currentPage ? currentPage : 1;
    let defaultLimit = limit ? limit : 5;
    let skip = (defaultCurrent - 1) * defaultLimit;
    const totalItem = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItem / defaultLimit)
    let result = await this.roleModel.find(filter)
      .skip(skip)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec()
      ;

    return  {
      meta: {
        current: defaultCurrent,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItem
      }, 
      result
    }; 
  }

  async findOne(id: string) {
    return (await this.roleModel.findOne({_id: id}))
    .populate({ 
      path: "permissions",
      select: {_id: 1, apiPath: 1, name: 1, method: 1, module: 1}
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    return await this.roleModel.updateOne({_id: id}, {
      ...updateRoleDto,
      updatedBy:{
        _id: user._id, 
        email: user.email
      }
    }); 
  }
 
  async remove(id: string, user: IUser)  {
    const foundRole = await this.roleModel.findById(id);
    if(foundRole.name === ADMIN_ROLE){
      throw new BadRequestException("Can not delete role ADMIN")
    }
    await this.roleModel.updateOne({_id: id}, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    return await this.roleModel.softDelete({_id: id});
  }
}
