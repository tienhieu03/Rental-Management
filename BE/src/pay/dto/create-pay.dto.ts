import { IsString } from "class-validator";
import mongoose from "mongoose";

export class CreatePayDto {

    @IsString()
    userId: mongoose.Schema.Types.ObjectId;

    @IsString()
    nameConfig: string;

    @IsString()
    clientId: string;

    @IsString()
    apiKey: string;

    @IsString()
    checksumKey: string;
}
