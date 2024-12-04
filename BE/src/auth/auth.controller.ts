import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CodeAuthDto, CodeResetPasswordDto, RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/user.interface';
import { RoleService } from 'src/role/role.service';
import { days, Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { MailerService } from '@nestjs-modules/mailer';

@Controller("auth")
export class AuthController {
    constructor(

        private authService: AuthService,
        private rolesService: RoleService,
        private readonly mailerService: MailerService
    ) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @UseGuards(ThrottlerGuard)
    @Post('/login')
    @ResponseMessage("User Login")
    handleLogin(@Req() req,
        @Res({ passthrough: true }) response: Response
    ) {
        return this.authService.login(req.user, response);
    }


    @Public()
    @ResponseMessage('Register a user success')
    @Post('/register')
    handleRegister(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    @Public()
    @ResponseMessage('Register a user success')
    @Post('/mail')
    handleSendCode(@Body() _id: string) {
        this.mailerService
            .sendMail({
                to: 'dogiang122003@gmail.com', // list of receivers
                from: '"Kích hoạt tài khoản" <abc@gmail.com>', // sender address
                subject: 'Xác thực tài khoản ✔', // Subject line
                text: 'welcome', // plaintext body
                template: 'verifyCode',
                context:{
                    receiver: "Giang",
                    activeCode: '123123'
                }
            })
        return;
    }

    @Public()
    @ResponseMessage('Verify a user success')
    @Post('/check-code')
    handleCheckCode(@Body() codeAuthDto: CodeAuthDto) {
        return this.authService.checkCode(codeAuthDto);
    }

    @Public()
    @ResponseMessage('Create new password success!')
    @Post('/reset-password')
    handleResetPassword(@Body() codeResetPasswordDto: CodeResetPasswordDto) {
        return this.authService.resetPassword(codeResetPasswordDto);
    }

    @Public()
    @ResponseMessage('Retry Verify a user success')
    @Post('/retry-code')
    handleRetryCheckCode(@Body('email') email: string) {
        return this.authService.retryCode(email);
    }


    @ResponseMessage('Get a account success')
    @Get('/account')
    async handleGetAccount(@User() user: IUser) {
        const temp = await this.rolesService.findOne(user.role._id) as any;
        user.permissions = temp.permissions
        return { user };
    }

    @Public()
    @ResponseMessage('Get User by refresh token')
    @Get('/refresh')
    handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const refresh_token = request.cookies["refresh_token"];

        return this.authService.processNewToken(refresh_token, response);
    }

    @ResponseMessage('Logout User')
    @Post('/logout')
    handleLogout(@User() user: IUser, @Res({ passthrough: true }) response: Response) {


        return this.authService.logout(user, response);
    }


}