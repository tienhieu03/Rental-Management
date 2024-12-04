import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/user.interface';
import { CodeAuthDto, CodeResetPasswordDto, RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { response, Response } from 'express';
import { RoleService } from 'src/role/role.service';


@Injectable()
export class AuthService {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
        private jwtService: JwtService,
        private roleSerivce: RoleService,
      

    ) { }



    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(password, user.password);
            if (isValid) {
                const userRole = user.role as unknown as { _id: string, name: string };
                const temp = await this.roleSerivce.findOne(userRole._id);

                const objUser = {
                    ...user.toObject(),
                    permissions: temp?.permissions ?? []
                }
                return objUser;
            }
            
        }
        return null;


    }

    async login(user: IUser, response: Response) {
        const { _id, name, email, role, permissions, avatar } = user;

        const payload = {
            sub: 'token login',
            iss: 'from server',
            _id,
            name,
            email,
            role,
            avatar
            //permissions,

        };
        const refresh_token = this.createRefreshToken(payload);
        await this.usersService.updateUserToken(refresh_token, _id);

        const userRole = user.role as unknown as { _id: string, name: string }
        const temp = await this.roleSerivce.findOne(userRole._id);
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE'))
        })

        return {
            access_token: this.jwtService.sign(payload),

            user: {
                _id,
                name,
                email,
                role,
                avatar,
                permissions: temp?.permissions ?? []
            }
        };

    }

    async register(registerUserDto: RegisterUserDto) {

        if (await this.usersService.isEmailExist(registerUserDto)) {
            throw new BadRequestException(`Email: ${registerUserDto.email} is exist`);
        }
        let newUser = await this.usersService.register(registerUserDto);

        
        return {
            _id: newUser?._id,
            createdAT: newUser?.createdAt
        };

    }
    async checkCode(codeAuthDto: CodeAuthDto) {
        return this.usersService.handleActive(codeAuthDto);
    }
    async retryCode(email: string) {
        return this.usersService.handleRetryCode(email);
    }

    async resetPassword(codeResetPasswordDto: CodeResetPasswordDto) {
        return this.usersService.handleResetPassword(codeResetPasswordDto);
    }

    createRefreshToken = (payload) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000

        });

        return refresh_token
    }

    processNewToken = async (refresh_token: string, response: Response) => {
        try {
            this.jwtService.verify(refresh_token, {
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')
            })
            let user = await this.usersService.findUserByToken(refresh_token);
            if (user) {

                const { _id, name, email, role, avatar } = user;

                const payload = {
                    sub: 'token login',
                    iss: 'from server',
                    _id,
                    name,
                    email,
                    role,
                    avatar
                };
                const refresh_token = this.createRefreshToken(payload);
                response.clearCookie('refresh_token')
                response.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE'))
                })
                await this.usersService.updateUserToken(refresh_token, _id.toString());

                return {
                    access_token: this.jwtService.sign(payload),

                    user: {
                        _id,
                        name,
                        email,
                        role
                    }
                };

            } else {
                throw new BadRequestException(`Refresh is invalid`);

            }

        } catch (error) {
            throw new BadRequestException(`Refresh is invalid`);

        }

    }

    logout = async (user: IUser, response: Response) => {
        await this.usersService.updateUserToken("", user._id);
        response.clearCookie("refresh_token");
        return "logout ok"
    }
}