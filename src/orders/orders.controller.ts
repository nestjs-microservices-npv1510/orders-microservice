import {
  Body,
  Controller,
  NotImplementedException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({ cmd: 'create_order' })
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern({ cmd: 'find_all_orders' })
  findAll() {
    return this.ordersService.findAll();
  }

  @MessagePattern({ cmd: 'find_an_order' })
  findOne(@Payload() id: number) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern({ cmd: 'change_order_status' })
  changeOrderStatus(@Payload() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+updateOrderDto.id, updateOrderDto);
  }

  @MessagePattern({ cmd: 'update_order' })
  update(@Payload() updateOrderDto: UpdateOrderDto) {
    // return this.ordersService.update(updateOrderDto.id, updateOrderDto);
    throw new NotImplementedException();
  }

  @MessagePattern({ cmd: 'delete_order' })
  remove(@Payload() id: number) {
    return this.ordersService.remove(id);
  }
}
