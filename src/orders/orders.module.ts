import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

import * as config from '../config';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    // ClientsModule.register([
    //   {
    //     name: config.PRODUCT_MICROSERVICE_NAME,
    //     transport: Transport.TCP,
    //     options: {
    //       host: config.envs.product_microservice_host,
    //       port: config.envs.product_microservice_port,
    //     },
    //   },
    // ]),
    NatsModule,
  ],
})
export class OrdersModule {}
