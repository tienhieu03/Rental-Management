import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateContractDto } from './create-contract.dto';

export class UpdateContractDto extends OmitType(CreateContractDto, ['room', 'tenant', 'startDate', 'depositAmount'] as const) {}
