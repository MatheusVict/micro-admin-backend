import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CategoriesInterface } from './interface/categories/categories.interface';

const ackErros: string[] = ['E11000', '', ''];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @EventPattern('criar-categoria')
  async createCategory(
    @Payload() category: CategoriesInterface,
    @Ctx() context: RmqContext /*Contexto da requisição, Rmq = RabbitMQ */,
  ) {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();

    this.logger.log(`categoria: ${JSON.stringify(category)}`);

    try {
      await this.appService.createCategory(category);
      await channel.ack(originMessage); //Confirmação de uma menssagem recebida pode ser apagadacom sucesso
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);
      ackErros.map(async (ackErro) => {
        if (error.menssage.includes(ackErro)) {
          await channel.ack(originMessage);
        }
      });
    }
  }

  @MessagePattern('pegar-categoria')
  async getOne(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();

    if (_id) {
      try {
        const category = await this.appService.getOne(_id);
        await channel.ack(originMessage); // Já faz tudo automaticamente

        return category;
      } catch (error) {
        this.logger.error(error.message);
      }
    }

    await channel.ack(originMessage);
    return await this.appService.findAll();
  }
}
