import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { OrderStatusList } from '../enum';

export class ChangeOrderStatusDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  id: number;

  @IsEnum(OrderStatusList, {
    message: 'Order status must be a PENDING, CANCELLED OR COMPLETED',
  })
  status: OrderStatus;
}
