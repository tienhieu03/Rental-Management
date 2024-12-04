import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Contract, ContractDocument } from './schemas/contract.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { Room, RoomDocument } from 'src/rooms/schemas/room.schema';

import { Cron } from '@nestjs/schedule';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

const { ObjectId } = mongoose.Types;

@Injectable()
export class ContractsService {
  constructor(
    private mailerService: MailerService,
    @InjectModel(Contract.name) private contractModel: SoftDeleteModel<ContractDocument>,
    private configService: ConfigService,
    @InjectModel(Room.name) private roomModel: SoftDeleteModel<RoomDocument>) { }

  async create(createContractDto: CreateContractDto, user: IUser) {
    const isExist = await this.roomModel.findOne({
      _id: createContractDto.room._id,
      status: "OCCUPIED"
    }
    );
    if (isExist) {
      throw new BadRequestException('Data is not valid!');
    }

    const contract = await this.contractModel.create({
      ...createContractDto,
      innkeeper: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        idCard: user.idCard
      },
      createdBy: {
        _id: user._id,
        email: user.email,
        name: user.name
      }
    })

    const startDate = dayjs(contract.startDate);
    const endDate = dayjs(contract.endDate);


    const invoiceDetails = [];
    let currentDate = startDate;
    while (currentDate.isBefore(endDate)) {
      let nextDate = currentDate.add(contract.rentCycleCount, 'month');
      if (nextDate.isAfter(endDate)) {
        nextDate = endDate;
      }
      const months = Math.ceil(nextDate.diff(currentDate, 'month', true));
      invoiceDetails.push({
        date: currentDate.format('YYYY-MM-DD'),
        months: months,
      });
      currentDate = nextDate;
    }
    await this.contractModel.updateOne({ _id: contract._id }, { invoiceDetails: invoiceDetails });
    await this.roomModel.updateOne({ _id: createContractDto.room._id }, { status: "OCCUPIED" });

    return {
      _id: contract._id,
      createdAt: contract.createdAt
    };
  }

  async findAll(currentPage: number, pageSize: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.currentPage;
    delete filter.pageSize;
    const defaultCurrentPage = currentPage ? currentPage : 1;
    const defaultPageSize = pageSize ? pageSize : 5;
    const totalDocument = (await this.contractModel.find(filter)).length;
    let totalPage = Math.ceil(totalDocument / defaultPageSize);
    let skip = (defaultCurrentPage - 1) * pageSize;


    const result = await this.contractModel.find(filter)
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

  async findByTenantId(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Id is not valid!')
    }
    return await this.contractModel.find({ "tenant._id": id })

  }
  async findByTenantIdAndContractActive(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Id is not valid!')
    }
    const day = dayjs().startOf('day');
    const tomorrow = day.add(1, "day").startOf('day').date();
    return await this.contractModel.find(
      {
        $or: [
          { "tenant._id": id },
          { "tenant._id": new ObjectId(id) }
        ]
        ,
        status: 'ACTIVE'
      });
  }

  async findContractActive() {
    const today = dayjs();
    return await this.contractModel.find({ status: 'ACTIVE', endDate: { $gte: today } });

  }
  async findRoomInContractActive(id: string) {

    return await this.contractModel.findOne({ "room._id": id, status: 'ACTIVE' });

  }

  async update(id: string, updateContractDto: UpdateContractDto, user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Id is not valid!')
    }

    const isExist = await this.contractModel.findOne({ _id: id, isDeleted: false });
    if (isExist) {
        await this.contractModel.updateOne({ _id: id }, {
        ...updateContractDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
          name: user.name

        },

      });
      const contract = await this.contractModel.updateOne({ _id: id, status: "CANCELED" }, {actualEndDate: dayjs()})
      if(contract){
        const room = await this.roomModel.updateOne({
        _id: new ObjectId(isExist.room._id.toString())
        }, {status: "AVAILABLE"})
        return contract;
      }
    }
    throw new BadRequestException('Something wrong!!!');
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Id is not valid!')
    }
    await this.contractModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email,
        name: user.name
      }
    })
    return await this.contractModel.softDelete({ _id: id });
  }

  @Cron('0 6 * * * *')
  async autoUpdateStatus() {
    const today = dayjs().startOf('day');
    await this.contractModel.updateMany({ endDate: { $lt: today }, status: "ACTIVE" }, { status: "EXPIRED", actualEndDate: dayjs() })
  }



  @Cron('0 10 * * *')
  async autoSendEmailExpire() {
    const expireMonthDown = dayjs().add(45, 'days');
    const expireMonthUp = dayjs(expireMonthDown).add(1, 'days');
    const urlFe = this.configService.get<string>('URL_FE') + "/user" ;
    const contracts = await this.contractModel.find({ endDate: { $gte: expireMonthDown, $lt: expireMonthUp }, status: 'ACTIVE' })
    for (const contract of contracts) {
      await this.mailerService.sendMail({
        to: contract.tenant.email,
        from: '"Thông báo gia hạn hợp đồng" <abc@gmail.com>',
        subject: "Gia Hạn Hợp Đồng",
        template: 'expireContract.hbs',
        context: {
          receiver: contract.tenant.name,
          startDate: dayjs(contract.startDate).format('DD/MM/YYYY'),
          endDate: dayjs(contract.endDate).format('DD/MM/YYYY'),
          location: contract.room.roomName,
          price: contract.room.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " đ",
          url: urlFe
        }

      })
    }


  }

}
