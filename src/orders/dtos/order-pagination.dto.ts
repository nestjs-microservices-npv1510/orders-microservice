import { PaginationDTO } from './pagination.dto';
import { IsEnum, IsOptional } from 'class-validator';

import { OrderStatus } from '@prisma/client';
import { OrderStatusList } from 'src/orders/enums';
import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import MessagePayloadDto from 'src/common/dtos/message-payload.dto';

const CombinedDto = IntersectionType(PaginationDTO, MessagePayloadDto);

export class OrderPaginationDTO extends PartialType(CombinedDto) {
  @IsOptional()
  @IsEnum(OrderStatusList, {
    message: 'Order status must be PENDING, CANCELLED or COMPLETED',
  })
  status: OrderStatus;
}
