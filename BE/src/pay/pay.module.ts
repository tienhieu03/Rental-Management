import { Module } from '@nestjs/common';
import { PayService } from './pay.service';
import { PayController } from './pay.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pay, PaySchema } from './schemas/pay.schema';
import { ConfigModule } from '@nestjs/config';
import { InvoicesModule } from 'src/invoices/invoices.module';


@Module({
  imports: [MongooseModule.forFeature([{name: Pay.name, schema: PaySchema}]),

  ConfigModule,
  InvoicesModule,
  
],
  controllers: [PayController],
  providers: [PayService],
  exports: [PayService]
})
export class PayModule {}
