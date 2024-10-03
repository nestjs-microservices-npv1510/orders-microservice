import { Controller, Logger, ParseUUIDPipe } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';

import { OrderPaginationDTO } from './dtos/order-pagination.dto';
import { CreateOrderDto } from './dtos/create-order.dto';
import { ChangeOrderStatusDto } from './dtos/change-order-status.dto';
import { PaidOrderDto } from './dtos/paid-order.dto';

@Controller()
export class OrdersController {
  private readonly logger = new Logger('OrdersController');
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('orders.create')
  async create(@Payload() createOrderDto: CreateOrderDto) {
    // console.log('orders controller create');
    // console.log(createOrderDto);
    // return;
    const { metadata, ...dto } = createOrderDto;
    this.logger.log(`Message payload: ${JSON.stringify(createOrderDto)}`);
    // console.log(dto);
    // return dto;
    const order = await this.ordersService.create(dto);
    // return order;

    const paymentSession = await this.ordersService.createPaymentSession(order);
    return {
      status: 'success',
      data: {
        order,
        paymentSession,
      },
    };
  }

  @MessagePattern('orders.findMany')
  async findMany(@Payload() orderPaginationDto: OrderPaginationDTO) {
    this.logger.log(
      `Received find many message with payload: ${JSON.stringify(orderPaginationDto)}`,
    );

    return {
      status: 'success',
      data: await this.ordersService.findMany(orderPaginationDto),
    };
  }

  @MessagePattern('orders.findOrderById')
  async findOrderById(@Payload('id', ParseUUIDPipe) id: string) {
    this.logger.log(
      `Received find order by id message with id: #${JSON.stringify(id)}`,
    );

    // console.log('orders controller findOrderById');
    // return id;
    return { status: 'success', data: await this.ordersService.findOne(id) };
  }

  @MessagePattern('orders.changeOrderStatus')
  async changeOrderStatus(
    @Payload() changeOrderStatusDto: ChangeOrderStatusDto,
  ) {
    const { metadata, id, ...updateDataDto } = changeOrderStatusDto;
    // console.log(updateDataDto);
    // return { changeOrderStatusDto, updateDataDto };
    this.logger.log(
      `Received change order status message with id: #${JSON.stringify(id)}`,
    );
    return {
      status: 'success',
      data: {
        order: await this.ordersService.changeOrderStatus(id, updateDataDto),
      },
    };
  }

  @EventPattern('charge.succeeded')
  paidOrder(@Payload() paidOrderDto: PaidOrderDto) {
    this.logger.log(
      `Received paid order message with payload: ${JSON.stringify(paidOrderDto)}`,
    );

    // return paidOrderDto;
    return this.ordersService.paidOrder(paidOrderDto);
  }

  // @MessagePattern({ cmd: 'delete_order' })
  // remove(@Payload() id: number) {
  //   return this.ordersService.remove(id);
  // }
}
