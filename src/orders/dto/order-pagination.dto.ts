import { PaginationDTO } from './pagination.dto';
import { IsEnum, IsOptional } from 'class-validator';

import { OrderStatus } from '@prisma/client';
import { OrderStatusList } from 'src/orders/enum';

export class OrderPaginationDTO extends PaginationDTO {
  @IsOptional()
  @IsEnum(OrderStatusList, {
    message: 'Order status must be PENDING, CANCELLED or COMPLETED',
  })
  status: OrderStatus;
}
