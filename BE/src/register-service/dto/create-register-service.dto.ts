import { Prop } from "@nestjs/mongoose";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateRegisterServiceDto {

    @IsString()
    service: string;
  
    @IsString()
    user: mongoose.Schema.Types.ObjectId;
  
    @IsString()
    room: mongoose.Schema.Types.ObjectId;
  
    @IsOptional()
    @IsString()
    status: string;

    @IsOptional()
    @IsBoolean()
    type: boolean;

    @IsOptional()
    @IsBoolean()
    executeNow: boolean;

    @IsOptional()
    implementationDate: string;
    

}
