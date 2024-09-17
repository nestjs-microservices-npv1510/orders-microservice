// import { OrderStatus } from '../enum';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  isArray,
  IsBoolean,
  IsEnum,
  isNumber,
  IsNumber,
  IsOptional,
  isPositive,
  ValidateNested,
} from 'class-validator';

import { OrderStatusList } from '../enum';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true }) // Validate mỗi phần tử trong mảng
  @Type(() => OrderItemDto) // Chuyển đổi mỗi phần tử sang instance của OrderItemDto
  items: OrderItemDto[];
}
