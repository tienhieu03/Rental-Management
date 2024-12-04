
import { IsArray, IsDateString, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, Length, MaxLength, MinLength } from "class-validator"
import mongoose from "mongoose";

export class CreateUserDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsOptional()
    name: string

    @IsDateString()
    @IsOptional()
    birthday: Date

    @IsNumberString()
    @IsOptional()
    @MaxLength(12)
    @MinLength(12)
    idCard: string

    @IsNumberString()
    @IsOptional()
    @MaxLength(10)
    @MinLength(10)
    phone: string

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    imagesIdCard: string[]

    @IsOptional()
    @IsString()
    avatar: string;

    @IsString()
    @IsOptional()
    gender: string

    @IsString()
    @IsOptional()
    address: string

    @IsString()
    @IsOptional()
    role: mongoose.Schema.Types.ObjectId


}

export class RegisterUserDto {

    @IsString()
    @IsNotEmpty({ message: 'Email is invalid' })
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    @Length(6, 20)
    password: string

    @IsString()
    @IsOptional()
    name: string


    @IsDateString()
    birthday: Date

    @IsString()
    @IsOptional()
    gender: string


    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    imagesIdCard: string[]

    @IsOptional()
    @IsString()
    avatar: string;

    @IsString()
    @IsOptional()
    address: string

    @IsNumberString()
    @Length(12)
    @IsOptional()
    idCard: string

    @IsNumberString()
    @Length(10)
    @IsOptional()
    phone: string



}

export class CodeAuthDto {

    @IsString()
    _id: string

    @IsString()
    codeId: string

}

export class CodeResetPasswordDto {

    @IsString()
    _id: string

    @IsString()
    codeId: string

    @IsString()
    password: string

}