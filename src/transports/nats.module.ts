import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import * as config from '../config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: config.NATS_SERVICE_NAME,
        transport: Transport.NATS,
        options: {
          servers: config.envs.nats_servers,
        },
      },
    ]),
  ],
  exports: [
    ClientsModule.register([
      {
        name: config.NATS_SERVICE_NAME,
        transport: Transport.NATS,
        options: {
          servers: config.envs.nats_servers,
        },
      },
    ]),
  ],
})
export class NatsModule {}
