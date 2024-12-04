import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Invoice, InvoiceSchema } from 'src/invoices/schemas/invoice.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { Role, RoleSchema } from 'src/role/schemas/role.schema';
import { Service, ServiceSchema } from 'src/services/schemas/service.schema';
import { InvoicesService } from 'src/invoices/invoices.service';
import { Pay, PaySchema } from 'src/pay/schemas/pay.schema';
import { PayModule } from 'src/pay/pay.module';

@Module({
  imports: [
     PayModule,
    MailerModule.forRootAsync({
     
      useFactory: async (configService: ConfigService) => ({

        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          secure: false,
          auth: {
            user: configService.get<string>('EMAIL_AUTH_USER'),
            pass: configService.get<string>('EMAIL_AUTH_PASS'),
          },
        },
        
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        preview: true
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Pay.name, schema: PaySchema },
    ]),


  ],


  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],

})
export class MailModule { }
