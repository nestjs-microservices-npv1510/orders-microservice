import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  isNumber,
  IsNumber,
  IsOptional,
  isPositive,
} from 'class-validator';

import { OrderStatusList } from '../enum';

export class CreateOrderDto {
  @IsNumber()
  @Type(() => Number)
  total: number;

  @IsNumber()
  @Type(() => Number)
  numItems: number;

  @IsEnum(OrderStatusList, {
    message: 'Order status must be one PENDING or CANCELLED OR COMPLETED',
  })
  @IsOptional()
  status: OrderStatus = OrderStatus.PENDING;

  @IsBoolean()
  @IsOptional()
  paid: boolean = false;
}
