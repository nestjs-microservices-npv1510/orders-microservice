import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { OrderPaginationDTO } from './dto/order-pagination.dto';

import * as config from '../config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrdersService');

  constructor(
    @Inject(config.PRODUCT_MICROSERVICE_NAME)
    private productsClient: ClientProxy,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('PostgreSQL database initialized !');
  }

  async create(createOrderDto: CreateOrderDto) {
    // return this.order.create({ data: createOrderDto });
    const productIds = createOrderDto.items.map((item) => item.productId);

    try {
      const validProducts = await firstValueFrom(
        this.productsClient.send({ cmd: 'validate_products' }, productIds),
      );

      // TOTAL
      let total = 0;
      let numItems = 0;

      // console.log(validProducts);

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

      return {
        order: {
          ...newOrder,
          items: newOrder.items.map((item) => {
            return {
              name: validProducts.find((p) => p.id === item.productId).name,
              ...item,
            };
          }),
        },
      };
    } catch (err) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: err.message,
      });
    }
  }

  async findAll(orderPaginationDto: OrderPaginationDTO) {
    const { page = 1, limit = 3, status } = orderPaginationDto;
    const totalItems = await this.order.count({ where: { status } });

    // console.log(status);

    return {
      data: await this.order.findMany({
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

  async findOne(id: number) {
    // const order = await this.order.findFirst({ where: { id } });
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

    // console.log(order);
    const validProducts = await firstValueFrom(
      this.productsClient.send(
        { cmd: 'validate_products' },
        order.items.map((i) => i.productId),
      ),
    );

    console.log(validProducts);

    if (!order)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`,
      });

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

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    // const order = await this.findOne(id);
    // if (order.status === updateOrderDto.status) return order;
    // return this.order.update({
    //   where: { id: id },
    //   data: updateOrderDto,
    // });
  }

  // remove(id: number) {
  //   return `This action removes a #${id} order`;
  // }
}
