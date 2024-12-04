import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';

export class UpdateServiceDto extends OmitType(CreateServiceDto, ['serviceName'] as const) {
    _id: string
}
