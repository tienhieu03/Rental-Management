import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import mongoose from 'mongoose';
import { use } from 'passport';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { USER_ROLE } from 'src/databases/sample';
import { Invoice, InvoiceDocument } from 'src/invoices/schemas/invoice.schema';

import { PayService } from 'src/pay/pay.service';
import { Pay, PayDocument } from 'src/pay/schemas/pay.schema';
import { Role, RoleDocument } from 'src/role/schemas/role.schema';
import { Service, ServiceDocument } from 'src/services/schemas/service.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';

const {ObjectId} = mongoose.Types;
@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private payService: PayService,
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Invoice.name)
    private invoiceModel: SoftDeleteModel<InvoiceDocument>,
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,

    @InjectModel(Service.name)
    private serviceModel: SoftDeleteModel<ServiceDocument>,

    @InjectModel(Pay.name)
    private payModel: SoftDeleteModel<PayDocument>
  ) { }

  @Cron("0 8 * * *")
  async autoSendMailInvoice() {
    const userRole = await this.roleModel.findOne({ name: USER_ROLE });
    const users = await this.userModel.find({ role: userRole?._id }).select('-password');
    for (const user of users) {
      
      const invoiceWithUserId = await this.invoiceModel.find({ $or: [
        { "tenant._id": user._id.toString() },
        { "tenant._id": new ObjectId(user._id) }
      ], send: false });
      if (invoiceWithUserId?.length > 0) {
        let totalMoney: number = 0;
        let invoices = invoiceWithUserId.map(item => {
          if (item.status === 'UNPAID') {
            totalMoney += item.amount;
            return {
              id: item._id,
              month: item.month,
              service: item.service.name,
              room: item.room?.roomName,
              unit: item.service.unit,
              firstIndex: item?.firstIndex,
              finalIndex: item?.finalIndex,
              price: item.service.priceUnit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + "đ",
              total: item?.totalNumber,
              money: item?.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + "đ"
            }
          }
        })
        if (invoices && invoices.length > 0) {
          

          for (const invoice of invoices) {
            await this.invoiceModel.updateOne({ _id: invoice.id }, { send: true });
          }
          await this.mailerService.sendMail({
            to: user.email,
            from: '"Thông báo hoá đơn" <abc@gmail.com>',
            subject: "Hoá đơn dịch vụ",
            template: 'invoiceT.hbs',
            context: {
              receiver: user.name,
              bills: invoices,
              paymentLink: "paymentLink.checkoutUrl",
              total: totalMoney.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " đ"
            }

          })
        }
      }
    }
  }
}
