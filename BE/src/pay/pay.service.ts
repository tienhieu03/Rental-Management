import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePayDto } from './dto/create-pay.dto';
import { UpdatePayDto } from './dto/update-pay.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pay, PayDocument } from './schemas/pay.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import PayOS from '@payos/node';
import { InvoicesService } from 'src/invoices/invoices.service';
import dayjs from 'dayjs';


@Injectable()
export class PayService {

  constructor(@InjectModel(Pay.name) private payModel: SoftDeleteModel<PayDocument>,
    private configService: ConfigService,
    private invoicesService: InvoicesService,

  ) {

  }

  encryptor = require('simple-encryptor')(this.configService.get<string>('KEY_CODE'));

  encode(data: string) {
    const encrypted = this.encryptor.encrypt(data);
    return encrypted;
  }



  decode(encrypted: string) {
    const decrypted = this.encryptor.decrypt(encrypted);
    return decrypted;
  }


  async create(createPayDto: CreatePayDto, user: IUser) {
    const isExist = await this.payModel.findOne({
      clientId: createPayDto.clientId,
      apiKey: createPayDto.apiKey,
      checksumKey: createPayDto.checksumKey
    })
    if (isExist) {
      throw new BadRequestException('Payment settings already exist!');
    }
    createPayDto.apiKey = this.encode(createPayDto.apiKey);
    createPayDto.clientId = this.encode(createPayDto.clientId);
    createPayDto.checksumKey = this.encode(createPayDto.checksumKey);
    const configPay = await this.payModel.create(
      {
        ...createPayDto,
        userId: user._id,
        createdBy: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      })

    return {
      _id: configPay._id,
      createdAt: configPay.createdAt
    }
  }


  async findAll() {
    return await this.payModel.find().select({ nameConfig: 1 });
  }

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Id is not valid!')
    }
    let config = await this.payModel.findOne({ _id: id });
    config.apiKey = this.decode(config.apiKey);
    config.clientId = this.decode(config.clientId);
    config.checksumKey = this.decode(config.checksumKey);


    return config;
  }

  async update(id: string, updatePayDto: UpdatePayDto, user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Id is not valid!')
    }
    return await this.payModel.updateOne({ _id: id }, {
      ...updatePayDto,
      updatedBy: {
        _id: user._id,
        name: user.name,
        email: user.email

      }
    });
  }

  async createLinkPayment(idInvoices: string[]) {
    let amount = 0;
    const idPay = Number(dayjs().format('YYYYMMDDHHmmss'));
    for (const idInvoice of idInvoices) {
      const invoice = await this.invoicesService.findOne(idInvoice);
      if (invoice) {
        amount += invoice.amount;
      }
    }
    // }
    const payOS = new PayOS(
      this.configService.get<string>('CLIENT_ID_PAYOS'),
      this.configService.get<string>('API_KEY_PAYOS'),
      this.configService.get<string>('CHECKSUM_KEY_PAYOS'),
    );
    const order = {
      amount: amount,
      description: idPay.toString(),
      orderCode: idPay,
      returnUrl: `${this.configService.get<string>('URL_FE')}/user/invoiceUser`,
      cancelUrl: `${this.configService.get<string>('URL_FE')}/user/invoiceUser`,
    }

    const paymentLink = await payOS.createPaymentLink(order);
    return paymentLink;
  }



  async remove(id: string, user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Id is not valid!')
    }
    await this.payModel.updateOne({ _id: id }, { deletedBy: { _id: user._id, name: user.name, email: user.email } })
    return await this.payModel.softDelete({ _id: id });
  }

  async checkStatusPayment(id: number, idInvoices: string[]) {
    const payOS = new PayOS(
      this.configService.get<string>('CLIENT_ID_PAYOS'),
      this.configService.get<string>('API_KEY_PAYOS'),
      this.configService.get<string>('CHECKSUM_KEY_PAYOS'),
    );
    const inforInvoice = await payOS.getPaymentLinkInformation(id);
    if (inforInvoice.status === "PAID") {
      const update = await this.invoicesService.autoUpdateStatusInvoice(idInvoices);
     
    }
    return inforInvoice;

  }
} 
