
import { IsNumber, IsString} from "class-validator"

export class CreateServiceDto {
    @IsString()
    serviceName: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsString()
    unit: string;

    @IsString()
    type: string;

   
}
