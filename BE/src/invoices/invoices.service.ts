import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { IUser } from 'src/users/user.interface';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ServicesService } from 'src/services/services.service';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { Cron } from '@nestjs/schedule';
import dayjs from 'dayjs';
import { UsersService } from 'src/users/users.service';
import { ContractsService } from 'src/contracts/contracts.service';
import { RoomsService } from 'src/rooms/rooms.service';


@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: SoftDeleteModel<InvoiceDocument>,
    private servicesService: ServicesService,
    private userService: UsersService,
    private contractService: ContractsService,
    private roomService: RoomsService,
  ) { }


  async updateData(_id: string, data: any) {
    const service = await this.servicesService.findOne(data.serviceId);

    if (service.type === 'WATER' || service.type === 'ELECTRICITY') {
      const totalNumber = data.finalIndex - data.firstIndex;
      await this.invoiceModel.updateOne({ _id: _id },
        {
          totalNumber: totalNumber,
          amount: service.price * totalNumber
        })
    } else {
      await this.invoiceModel.updateOne({ _id: _id },
        {
          amount: service.price
        })
    }


  }

  async create(createInvoiceDto: CreateInvoiceDto, user: IUser) {

    if (createInvoiceDto.finalIndex - createInvoiceDto.firstIndex < 0) {
      throw new BadRequestException('Data is not valid!')
    }
    const service = await this.servicesService.findOne(createInvoiceDto.service._id.toString());
    let totalNumber: number;
    if (service.type === "ELECTRICITY" || service.type === "WATER") {
      totalNumber = createInvoiceDto.finalIndex - createInvoiceDto.firstIndex;
    } else {
      totalNumber = 1;
    }
    const price = totalNumber * service.price;

    const invoice = await this.invoiceModel.create({
      ...createInvoiceDto,
      status: "UNPAID",
      totalNumber: totalNumber,
      amount: price,
      send: false,
      priceUnit: service.price,
      createdBy: {
        _id: user._id,
        email: user.email,
        name: user.name
      }

    })
    return {
      _id: invoice._id,
      createAt: invoice.createdAt

    };
  }

  //@Cron('0 0 * * *')
  //@Cron('* * * * * *')
  async autoCreateInvoice() {
    const date = dayjs().subtract(1, 'month').format('MM-YYYY');
    const users = await this.userService.findUserByRole();
    for (const user of users) {
      const contracts = await this.contractService.findByTenantIdAndContractActive(user._id.toString());
      if (contracts && contracts.length > 0) {
        for (const contract of contracts) {
          const isCheck = this.checkDateInvoice(contract.startDate);
          if (isCheck) {
            const room = await this.roomService.findById(contract.room._id.toString());
            const services = room.services;
            for (const service of services) {
              const otherServices = await this.servicesService.findOne(service.toString());
              if (otherServices.type !== 'WATER' && otherServices.type !== 'ELECTRICITY') {
                const isExist = await this.invoiceModel.findOne({
                  "room._id:": room._id,
                  "tenant._id": user._id,
                  "service._id": otherServices._id,
                  month: date
                })
                if (!isExist) {
                  await this.invoiceModel.create({
                    "room._id:": room._id,
                    "tenant._id": user._id,
                    "service._id": otherServices._id,
                    "room.roomName:": room.roomName,
                    "tenant.name": user.name,
                    "service.name": otherServices.serviceName,
                    "tenant.email": user.email,
                    "tenant.idCard": user.idCard,
                    "service.unit": otherServices.unit,
                    "tenant.phone": user.phone,
                    "service.priceUnit": otherServices.price,
                    amount: otherServices.price,
                    month: date,
                    send: false,
                    status: "UNPAID",
                    description: `Dịch vụ ${otherServices.serviceName} ${date}`,

                  })
                }
              }
            }
          }

        }
      }
    }
    

  }

  checkDateInvoice(contractDate: Date) {
    const today = dayjs().startOf('day');
    if (today.date() === dayjs(contractDate).startOf('day').date()) {
      if (today.month() !== dayjs(contractDate).startOf('day').month()) {
        return true;
      } else {
        if (today.year() !== dayjs(contractDate).startOf('day').year()) {
          return true;
        }

      }
    }
    return false;
  }

  //@Cron('* 0 0 * * *')
  //@Cron('* * * * * *')
  async autoCreateInvoiceRent() {
    let date = "";
    const today = dayjs().format('YYYY-MM-DD');
    const contracts = await this.contractService.findContractActive();
    if (contracts && contracts.length > 0) {
      for (const contract of contracts) {
        for (let i = 1; i <= contract.rentCycleCount; i++) {
          date += dayjs().add(i, 'month').format('MM/YYYY') + " ";
        }
        const isExist = await this.invoiceModel.findOne({
          "tenant._id": contract.tenant._id,
          "room._id": contract.room._id,
          "service._id": contract.room._id,
          month: date
        })
        if (!isExist) {
          const invoiceDates = contract.invoiceDetails;

          for (const invoiceDate of invoiceDates) {
            const isCreateDate = dayjs('2024-11-02').isSame(invoiceDate.date, 'day');

            if (isCreateDate) {
              const invoiceRent = await this.invoiceModel.create({
                "room._id": contract.room._id,
                "room.roomName": contract.room.roomName,

                "tenant._id": contract.tenant._id,
                " tenant.name": contract.tenant.name,
                "tenant.idCard": contract.tenant.idCard,
                "tenant.phone": contract.tenant.phone,

                "service._id": contract.room._id,
                "service.name": "Tiền nhà",
                "service.unit": "tháng",
                "service.priceUnit": contract.room.price,

                send: false,
                amount: contract.room.price * invoiceDate.months,
                month: date,
                nextPaymentDate: dayjs().add(contract.rentCycleCount, 'months'),
                status: "UNPAID",
                description: `Tiền phòng ${contract.room.roomName} tháng ${date}`
              })
            }
          }


        }

      }
    }

    
  }


  async findAll(currentPage: number, pageSize: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.currentPage;
    delete filter.pageSize;
    const defaultCurrentPage = currentPage ? currentPage : 1;
    const defaultPageSize = pageSize ? pageSize : 5;
    const totalDocument = (await this.invoiceModel.find(filter)).length;
    let totalPage = Math.ceil(totalDocument / defaultPageSize);
    let skip = (defaultCurrentPage - 1) * pageSize;


    const result = await this.invoiceModel.find(filter)
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

  async findOneByUserId(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Id is not valid');
    }

    return await this.invoiceModel.find({ "tenant._id": id });
  }

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Id is not valid');
    }

    return await this.invoiceModel.findOne({ _id: id });
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto, user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Id is not valid');
    }
    await this.invoiceModel.updateOne({ _id: id }, {
      ...updateInvoiceDto,
      updatedBy: {
        _id: user._id,
        email: user.email,
        name: user.name
      }
    });
    const invoice = await this.invoiceModel.findOne({ _id: id });
    let update;
    if (invoice) {
      update = await this.invoiceModel.updateOne({ _id: id }, {
        totalNumber: invoice.finalIndex - invoice.firstIndex,
        amount: invoice.service.priceUnit * (invoice.finalIndex - invoice.firstIndex)
      });
    } else {
      throw new BadRequestException("Something wrong!!!")
    }





    return update;
  }
  async autoUpdateStatusInvoice (ids: string[]){
    for(const id of ids){
      await this.invoiceModel.updateOne({_id: id}, {status: "PAID"});
    }
    return "Auto Updated!"
  }

  async remove(id: string, user: IUser) {
    await this.invoiceModel.updateOne({ _id: id }, {
      updatedBy: {
        _id: user._id,
        email: user.email,
        name: user.name 
      }
    })
    return await this.invoiceModel.softDelete({ _id: id });
  }
}
