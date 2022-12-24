import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.AWS_RABBITMQ],
      noAck: false, // Só pode deletar a menssagem quando a gente devolver uma confirmação(Ack). Se não enivar uma reposta ele tenta enviar dnv dando erro de chave duplicada
      queue: 'admin-backend',
    },
  });

  await app
    .listen()
    .then(() => logger.log('Microservice online'))
    .catch((err) => logger.error(err.message));
}
bootstrap();
