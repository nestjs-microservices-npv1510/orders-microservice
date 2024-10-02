import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { OrderStatusList } from '../enums';
import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import MessagePayloadDto from 'src/common/dtos/message-payload.dto';

export class ChangeOrderStatusDto extends PartialType(MessagePayloadDto) {
  @IsString()
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsEnum(OrderStatusList, {
    message: 'Order status must be a PENDING, CANCELLED OR COMPLETED',
  })
  status: OrderStatus;
}
