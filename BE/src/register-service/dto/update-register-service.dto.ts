import { PartialType } from '@nestjs/mapped-types';
import { CreateRegisterServiceDto } from './create-register-service.dto';

export class UpdateRegisterServiceDto extends PartialType(CreateRegisterServiceDto) {}
