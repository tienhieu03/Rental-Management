import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room, RoomDocument } from './schemas/room.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/user.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { ContractsService } from 'src/contracts/contracts.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: SoftDeleteModel<RoomDocument>,
    private contractService: ContractsService,

  ) { }

  async create(createRoomDto: CreateRoomDto, user: IUser) {
    const isRoomExist = await this.roomModel.findOne({ roomName: createRoomDto.roomName });
    if (!isRoomExist) {
      const room = await this.roomModel.create({
        ...createRoomDto, createdBy: {
          _id: user._id,
          email: user.email,
          name: user.name
        }
      });
      return {
        _id: room._id,
        createdAt: room.createdAt
      }
    }

    throw new BadRequestException('Room number already exists');
  }

  async findAll(currentPage: number, pageSize: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.currentPage;
    delete filter.pageSize;
    const defaultCurrentPage = currentPage ? currentPage : 1;
    const defaultPageSize = pageSize ? pageSize : 5;
    const totalDocument = (await this.roomModel.find(filter)).length;
    let totalPage = Math.ceil(totalDocument / defaultPageSize);
    let skip = (defaultCurrentPage - 1) * pageSize;


    const result = await this.roomModel.find(filter)
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

  findById(id:string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Id Room is not valid!')
    }

    return this.roomModel.findOne({ _id: id });

  }



  async update(id: string, updateRoomDto: UpdateRoomDto, user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Id Room is not valid!')
    }

    if (updateRoomDto.status === "ACTIVE") {
      const isExist = await this.contractService.findRoomInContractActive(id);
      if (isExist) {
        throw new BadRequestException('Room has been rented!');
      }
    }
    
    const room = await this.roomModel.updateOne({ _id: id }, {
      ...updateRoomDto,
      updatedBy: {
        _id: user._id,
        email: user.email,
        name: user.name
      }
    })
    return room;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Id Room is not valid!')
    }
    await this.roomModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email,
        name: user.name
      }
    })

    return await this.roomModel.softDelete({ _id: id });
  }

  
}
