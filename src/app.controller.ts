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
      const filterAckERror = ackErros.filter((ackErro) =>
        error.menssage.includes(ackErro),
      );

      if (filterAckERror) await channel.ack(originMessage);
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
        const filterAckERror = ackErros.filter((ackErro) =>
          error.menssage.includes(ackErro),
        );

        if (filterAckERror) await channel.ack(originMessage);
      }
    }

    await channel.ack(originMessage);
    return await this.appService.findAll();
  }

  @EventPattern('atualizar-categoria')
  async updateCategory(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();
    this.logger.log(`data: ${JSON.stringify(data)}`);

    try {
      const _id: string = data.id;
      const category: CategoriesInterface = data.category;
      await this.appService.updateCategory(_id, category);
      await channel.ack(originMessage);
    } catch (error) {
      const filterAckERror = ackErros.filter((ackErro) =>
        error.menssage.includs(ackErro),
      );

      if (filterAckERror) await channel.ack(originMessage);
    }
  }
}
