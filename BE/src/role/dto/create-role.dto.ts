
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, isString, ValidateNested } from "class-validator";
import mongoose from "mongoose";


export class CreateRoleDto {
    

    @IsNotEmpty({message:'Name is not empty'})
    name: string;

    @IsNotEmpty({message:'description is not empty'})
    description: string;

    
    @IsNotEmpty({message:'IsActive is not empty'})
    isActive: boolean;
    
    
    @IsNotEmpty({message:'Permissions is not empty'})
    permissions: [mongoose.Schema.Types.ObjectId];
  
}