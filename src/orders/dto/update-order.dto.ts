import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsNumber, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsString()
  @IsUUID()
  id: string;
}
