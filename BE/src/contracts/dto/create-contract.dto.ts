
import { Type } from "class-transformer";
import { IsDate, IsDateString, IsDefined, IsEmail, IsNotEmptyObject, IsNumber, IsNumberString, IsObject, IsOptional, IsString, Length, length, ValidateNested, } from "class-validator"
import { RmOptions } from "fs";
import mongoose from "mongoose";

class roomDTO {
    @IsString()
    _id: mongoose.Schema.Types.ObjectId;

    @IsString()
    roomName: string

    @IsNumber()
    price: number
}

class tenantDTO {
    @IsString()
    _id: mongoose.Schema.Types.ObjectId;

    @IsString()
    name: string
    
    @IsEmail()
    @IsString()
    email: string

    @IsNumberString()
    @Length(12)
    idCard: string

    @IsNumberString()
    @Length(10)
    phone: string

    @IsString()
    address: string
}
export class CreateContractDto {

    
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => roomDTO)
    room: roomDTO;

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => tenantDTO)
    tenant: tenantDTO;

    @IsOptional()
    @IsDateString()
    startDate: Date;

    @IsDateString()
    @IsOptional()
    endDate: Date;

    @IsNumber()
    depositAmount: number

    @IsOptional()
    @IsNumber()
    rentCycleCount: number

    @IsString()
    status: string;

    @IsString()
    @IsOptional()
    address: string;

}
