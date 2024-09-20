import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { OrderStatusList } from '../enum';

export class ChangeOrderStatusDto {
  @IsString()
  @IsOptional()
  @IsUUID()
  id: string;

  @IsEnum(OrderStatusList, {
    message: 'Order status must be a PENDING, CANCELLED OR COMPLETED',
  })
  status: OrderStatus;
}
