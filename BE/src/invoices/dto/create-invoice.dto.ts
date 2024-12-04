import { Type } from "class-transformer";
import { IsDate, isDate, isDateString, IsDateString, IsDefined, IsEmail, IsInt, IsNotEmpty, IsNotEmptyObject, IsNumber, IsNumberString, IsObject, IsOptional, IsString, Length, ValidateNested } from "class-validator"
import mongoose from "mongoose";

class roomDTO {
    @IsString()
    _id: mongoose.Schema.Types.ObjectId;

    @IsString()
    roomName: string
}

class tenantDTO {
    @IsString()
    _id: mongoose.Schema.Types.ObjectId;

    @IsString()
    name: string

    @IsNumberString()
    @Length(12)
    idCard: string

    @IsNumberString()
    @Length(10)
    phone: string
}

class serviceDTO {
    @IsString()
    _id: mongoose.Schema.Types.ObjectId;

    @IsString()
    name: string

    @IsString()
    unit: string

    @IsNumber()
    priceUnit: number
}
export class CreateInvoiceDto {
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
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => serviceDTO)
    @IsOptional()
    service: serviceDTO;

    @IsNumber()
    @IsOptional()
    firstIndex: number;

    @IsNumber()
    @IsOptional()
    finalIndex: number;

    @IsOptional()
    @IsString()
    month: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsString()
    @IsOptional()
    status: string;

    
}
