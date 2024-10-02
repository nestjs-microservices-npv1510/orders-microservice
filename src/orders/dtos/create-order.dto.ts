// nestjs
import { PartialType } from '@nestjs/mapped-types';

// pipe
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';

// enum
import { OrderStatusList } from '../enums';

// dtos
import { OrderItemDto } from './order-item.dto';
import MessagePayloadDto from 'src/common/dtos/message-payload.dto';

export class CreateOrderDto extends PartialType(MessagePayloadDto) {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true }) // Validate mỗi phần tử trong mảng
  @Type(() => OrderItemDto) // Chuyển đổi mỗi phần tử sang instance của OrderItemDto
  items: OrderItemDto[];
}
