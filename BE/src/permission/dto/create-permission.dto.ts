import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, isString, ValidateNested } from "class-validator";
import mongoose from "mongoose";


export class CreatePermissionDto {
    

    @IsNotEmpty({message:'Name is not empty'})
    name: string;

    @IsNotEmpty({message:'ApiPath is not empty'})
    apiPath: number;

    
    @IsNotEmpty({message:'Method is not empty'})
    method: string;
    
    
    @IsNotEmpty({message:'Module is not empty'})
    module: string;

    
   

  
}