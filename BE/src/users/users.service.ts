import { BadRequestException, Injectable, SetMetadata } from '@nestjs/common';
import { CodeAuthDto, CodeResetPasswordDto, CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { USER_ROLE } from 'src/databases/sample';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { IUser } from './user.interface';
import aqp from 'api-query-params';
import { Role, RoleDocument } from 'src/role/schemas/role.schema';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { use } from 'passport';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
    private readonly mailerService: MailerService

  ) { }

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  isEmailExist = async (createUserDto: any) => {
    const isExist = await this.userModel.findOne({ email: createUserDto.email });
    if (isExist) {
      if (
        !isExist.isDeleted ||
        isExist.idCard === createUserDto.idCard ||
        isExist.phone === createUserDto.phone
      ) {
        return true;
      }
    } else {
      return false;
    }

  }
  async create(createUserDto: CreateUserDto, user: IUser) {
    if (await this.isEmailExist(createUserDto)) {
      throw new BadRequestException(`Customer information already exists`);
    }
    const hashPassword = this.hashPassword(createUserDto.password);
    createUserDto.password = hashPassword;
    let data = await this.userModel.create(
      {
        ...createUserDto,
        isActive: false,
        createdBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return {
      _id: data?._id,
      createdAt: data?.createdAt
    }


  }

  async register(registerUserDto: RegisterUserDto) {
    const userRole = await this.roleModel.findOne({ name: USER_ROLE });
    const code = uuidv4();
    const codeId = code.slice(0, 8);

    const hashPassword = this.hashPassword(registerUserDto.password);
    let user = await this.userModel.create(
      {
        ...registerUserDto,
        password: hashPassword,
        isActive: false,
        role: userRole?._id,
        codeId: codeId,
        codeExpire: dayjs().add(5, 'minutes')
      }
    )
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      from: '"Kích hoạt tài khoản" <abc@gmail.com>', // sender address
      subject: 'Xác thực tài khoản ✔', // Subject line
      template: 'verifyCode',
      context: {
        receiver: user?.name ?? user.email,
        activeCode: codeId
      }
    })
    return user;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let defaultCurrent = currentPage ? currentPage : 1;
    let skip = (defaultCurrent - 1) * limit;
    let defaultLimit = limit ? limit : 10;
    const totalItem = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItem / defaultLimit);
    let result = await this.userModel.find(filter)
      .skip(skip)
      .limit(defaultLimit)
      .sort(sort as any)
      .select(["-password", "-refresh_token"])
      .populate(population)
      .exec();

    return {
      meta: {
        current: defaultCurrent,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItem
      },
      result
    };
  }

  findOne(id: string) {
    return this.userModel.findOne({
      _id: id
    }).select("-password")
      .populate({ path: 'role', select: { name: 1, _id: 1 } })
      ;
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username
    })
      .populate({ path: "role", select: { name: 1 } })
      ;
  }

  isValidPassword(password: string, hashPassword: string) {
    return compareSync(password, hashPassword);
  }

  async changePassword(id: string, password: string, oldPassword: string) {
    const user = await this.userModel.findOne({ _id: id });
    const isTrueOldPass = this.isValidPassword(oldPassword, user.password);

    if (isTrueOldPass) {
      const hashPassword = this.hashPassword(password);
      return await this.userModel.updateOne({ _id: id }, { password: hashPassword });
    }

    throw new BadRequestException("The old password is incorrect!")

  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne({
      _id: id
    }, {
      ...updateUserDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async remove(id: string, user: IUser) {
    const foundUser = await this.userModel.findById(id);
    if (foundUser && foundUser.email === "admin@gmail.com") {
      throw new BadRequestException("Can not delete account Admin");
    }
    await this.userModel.updateOne({
      _id: id
    }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    return await this.userModel.softDelete({
      _id: id
    });

  }

  updateUserToken = async (refresh_Token: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refresh_token: refresh_Token })
      .populate({
        path: "role",
        select: { name: 1 }
      })
  }

  findUserByToken = async (refresh_Token: string) => {
    return (await this.userModel.findOne({ refresh_token: refresh_Token })).populate({
      path: 'role',
      select: { name: 1 }
    })
  }

  findUserByRole = async () => {

    const userRole = await this.roleModel.findOne({ name: USER_ROLE });

    const users = await this.userModel.find({ role: userRole?._id }).select('-password');

    return users;

  }

  handleActive = async (data: CodeAuthDto) => {
    const user = await this.userModel.findOne({
      _id: data._id,
      codeId: data.codeId
    })
    if (!user) {
      throw new BadRequestException('Invalid data!');
    }
    const isBeforeCheck = dayjs().isBefore(user.codeExpire);
    if (isBeforeCheck) {
      return await this.userModel.updateOne({ _id: data._id }, { isActive: true });
    } else {
      throw new BadRequestException('Invalid data!');
    }
  }

  handleRetryCode = async (email: string) => {
    const isExist = await this.userModel.findOne(
      {
        email: email
      }
    )
    if (!isExist) {
      throw new BadRequestException('Invalid data!');
    }
    const code = uuidv4();
    const codeId = code.slice(0, 8);
    await this.userModel.updateOne({ _id: isExist._id },
      {
        codeId: codeId,
        codeExpire: dayjs().add(5, 'minutes')
      }
    )

    this.mailerService.sendMail({
      to: email,
      from: isExist.isActive ? '"Request to retrieve password" <abc@gmail.com>' : '"Verify account" <abc@gmail.com>',
      subject: isExist.isActive ? 'Create a new password ✔' : 'Verify account ✔',
      template: isExist.isActive ? "resetPassword" : "verifyCode",
      context: {
        receiver: isExist?.name ?? isExist.email,
        activeCode: codeId
      }
    })
    return {
      _id: isExist._id
    }
  }

  handleResetPassword = async (data: CodeResetPasswordDto) => {
    const user = await this.userModel.findOne({
      _id: data._id,
      codeId: data.codeId
    })
    const hashPassword = this.hashPassword(data.password);

    if (!user) {
      throw new BadRequestException('Invalid data!');
    }
    const isBeforeCheck = dayjs().isBefore(user.codeExpire);
    if (isBeforeCheck) {
      return await this.userModel.updateOne({ _id: data._id }, { password: hashPassword });
    } else {
      throw new BadRequestException('Invalid data!');
    }
  }

}
