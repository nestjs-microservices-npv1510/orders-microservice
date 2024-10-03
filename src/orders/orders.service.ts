import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { PrismaClient } from '@prisma/client';
import {
  ClientProxy,
  EventPattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { OrderPaginationDTO } from './dtos/order-pagination.dto';

import * as config from '../config';
import { first, firstValueFrom } from 'rxjs';
import { OrderWithProducts } from './interfaces/order-with-products.interface';
import { PaidOrderDto } from './dtos/paid-order.dto';
import { ChangeOrderStatusDto } from './dtos/change-order-status.dto';
import { CustomClientProxyService } from 'src/common/services/custom-client-proxy.service';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrdersService');

  constructor(private readonly natsClientProxy: CustomClientProxyService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('PostgreSQL database initialized !');
  }

  async create(createOrderDto: CreateOrderDto) {
    // console.log('orderservice create');
    // return createOrderDto;
    const productIds = createOrderDto.items.map((item) => item.productId);

    const { products: validProducts } = await firstValueFrom(
      this.natsClientProxy.send('products.validate-order-products', {
        productIds,
      }),
    );

    // TOTAL
    let total = 0;
    let numItems = 0;

    createOrderDto.items.forEach((item) => {
      const validPrice = validProducts.find(
        (product) => product.id === item.productId,
      ).price;

      total += validPrice * item.quantity;
      numItems += item.quantity;
    });

    const newOrder = await this.order.create({
      data: {
        items: {
          createMany: {
            data: createOrderDto.items.map((item) => {
              return {
                productId: item.productId,
                price: validProducts.find(
                  (product) => product.id === item.productId,
                ).price,
                quantity: item.quantity,
              };
            }),
          },
        },

        total,
        numItems,
      },
      include: {
        items: {
          select: {
            productId: true,
            price: true,
            quantity: true,
          },
        },
      },
    });

    // return newOrder;
    return {
      // order: {
      ...newOrder,
      items: newOrder.items.map((item) => {
        return {
          name: validProducts.find((p) => p.id === item.productId).name,
          ...item,
        };
      }),
      // },
    };
  }

  async findMany(orderPaginationDto: OrderPaginationDTO) {
    const { page = 1, limit = 3, status } = orderPaginationDto;

    const totalItems = await this.order.count({ where: { status } });
    const totalPages = Math.ceil(totalItems / limit);

    if (page > totalPages)
      throw {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Page exceeds total pages',

        // others data
        page,
        totalPages,
      };

    return {
      orders: await this.order.findMany({
        where: { status },
        skip: (page - 1) * limit,
        take: limit,
      }),
      metaData: {
        page: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
      },
    };
  }

  async findOne(id: string) {
    // console.log('Order Service find one');
    // console.log(id);
    // return id;
    const order = await this.order.findFirst({
      where: { id },
      include: {
        items: {
          select: {
            productId: true,
            price: true,
            quantity: true,
          },
        },
      },
    });
    // return order;

    if (!order)
      throw {
        statusCode: HttpStatus.NOT_FOUND,
        message: `Order with id #${id} not found`,
      };

    // console.log(order);
    const { products: validProducts } = await firstValueFrom(
      this.natsClientProxy.send('products.validate-order-products', {
        productIds: order.items.map((i) => i.productId),
      }),
    );
    // console.log(validProducts);
    // return validProducts;

    if (!order)
      throw {
        statusCode: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`,
      };

    return {
      ...order,
      items: order.items.map((i) => {
        return {
          name: validProducts.find((p) => p.id === i.productId).name,
          ...i,
        };
      }),
    };
  }

  async changeOrderStatus(
    id: string,
    changeOrderStatusDto: ChangeOrderStatusDto,
  ) {
    const order = await this.findOne(id);

    if (order.status === changeOrderStatusDto.status) return order;
    return this.order.update({
      where: { id },
      data: { status: changeOrderStatusDto.status },
    });
  }

  async createPaymentSession(orderWithProducts: OrderWithProducts) {
    return await firstValueFrom(
      this.natsClientProxy.send('payments.createSession', {
        orderId: orderWithProducts.id,
        currency: 'usd',
        items: orderWithProducts.items,
        metaData: { orderId: orderWithProducts.id },
      }),
    );
  }

  async paidOrder(paidOrderDto: PaidOrderDto) {
    const order = await this.order.update({
      where: { id: paidOrderDto.orderId },
      data: {
        status: 'COMPLETED',
        paid: true,
        paidAt: new Date(),
        stripePaymentId: paidOrderDto.stripePaymentId,

        orderReceipt: {
          create: {
            receiptUrl: paidOrderDto.receiptUrl,
          },
        },
      },
    });
    return order;
  }
}
