import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

import * as config from '../config';
import { NatsModule } from 'src/transports/nats.module';
import { CustomClientProxyService } from 'src/common/services/custom-client-proxy.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, CustomClientProxyService],
  imports: [NatsModule],
})
export class OrdersModule {}
