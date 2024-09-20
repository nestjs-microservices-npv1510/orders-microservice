import {
  Body,
  Controller,
  NotImplementedException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';

import { OrderPaginationDTO } from './dto/order-pagination.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
import { PaidOrderDto } from './dto/paid-order.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({ cmd: 'create_order' })
  async create(@Payload() createOrderDto: CreateOrderDto) {
    // return createOrderDto;
    // return this.ordersService.create(createOrderDto);
    const order = await this.ordersService.create(createOrderDto);
    // console.log(order);

    const paymentSession = await this.ordersService.createPaymentSession(order);

    return { order, paymentSession };
    // return createOrderDto;
  }

  @MessagePattern({ cmd: 'find_all_orders' })
  findAll(@Payload() orderPaginationDto: OrderPaginationDTO) {
    console.log(orderPaginationDto);
    return this.ordersService.findAll(orderPaginationDto);
  }

  @MessagePattern({ cmd: 'find_an_order' })
  findOne(@Payload('id', ParseIntPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern({ cmd: 'change_order_status' })
  changeOrderStatus(@Payload() changeOrderStatusDto: ChangeOrderStatusDto) {
    return this.ordersService.update(
      changeOrderStatusDto.id,
      changeOrderStatusDto,
    );
  }

  @EventPattern('charge.succeeded')
  paidOrder(@Payload() paidOrderDto: PaidOrderDto) {
    console.log(paidOrderDto);
    // return paidOrderDto;
    return this.ordersService.paidOrder(paidOrderDto);
  }

  // @MessagePattern({ cmd: 'update_order' })
  // update(@Payload() updateOrderDto: UpdateOrderDto) {
  //   // return this.ordersService.update(updateOrderDto.id, updateOrderDto);
  //   throw new NotImplementedException();
  // }

  // @MessagePattern({ cmd: 'delete_order' })
  // remove(@Payload() id: number) {
  //   return this.ordersService.remove(id);
  // }
}
