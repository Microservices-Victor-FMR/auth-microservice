import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const context = await NestFactory.createApplicationContext(AppModule);
  const configService = context.get(ConfigService)
  const NATS_URL = configService.get<string>('NATS_URL')
  context.close()
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,


  {
    transport: Transport.NATS,
    options: {
      servers: [NATS_URL],
    }
  }
)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
    
  )
  await app.listen();
}
bootstrap();
