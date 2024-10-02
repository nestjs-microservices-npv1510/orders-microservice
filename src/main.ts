// NestJs
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';

// modules
import { AppModule } from './app.module';

// envs
import * as config from './config';
import { RpcCatchErrorInterceptor } from './common/interceptors/rpcCatchError.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: config.envs.nats_servers,
      },
    },
  );

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //   }),
  // );

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new RpcCatchErrorInterceptor(),
  );

  await app.listen();
  logger.log(`Orders Microservice is running...`);
}
bootstrap();
