import { Controller, Logger } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CategoriesInterface } from 'src/categories/interfaces/categories/categories.interface';

const ackErros: string[] = ['E11000'];

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  private readonly logger = new Logger(CategoriesController.name);

  @EventPattern('criar-categoria')
  async createCategory(
    @Payload() category: CategoriesInterface,
    @Ctx() context: RmqContext /*Contexto da requisição, Rmq = RabbitMQ */,
  ) {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();

    this.logger.log(`categoria: ${JSON.stringify(category)}`);

    try {
      await this.categoriesService.createCategory(category);
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
        const category = await this.categoriesService.getOne(_id);
        await channel.ack(originMessage); // Já faz tudo automaticamente

        return category;
      } catch (error) {
        this.logger.error(`O Erro foi id :${JSON.stringify(error.message)}`);
        const filterAckERror = ackErros.filter((ackErro) =>
          error.menssage.includes(ackErro),
        );

        if (filterAckERror) await channel.ack(originMessage);
      }
    }

    await channel.ack(originMessage);
    return await this.categoriesService.findAll();
  }

  @EventPattern('atualizar-categoria')
  async updateCategory(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();
    this.logger.log(`data: ${JSON.stringify(data)}`);

    try {
      const _id: string = data.id;
      const category: CategoriesInterface = data.category;
      await this.categoriesService.updateCategory(_id, category);
      await channel.ack(originMessage);
    } catch (error) {
      const filterAckERror = ackErros.filter((ackErro) =>
        error.menssage.includes(ackErro),
      );

      if (filterAckERror) await channel.ack(originMessage);
    }
  }

  @EventPattern('apagar-categoria')
  async deleteCategory(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();
    try {
      await this.categoriesService.delete(id);
      await channel.ack(originMessage);
    } catch (error) {
      this.logger.error(`O Erro foi:${JSON.stringify(error.message)}`);
      const filterAckERror = ackErros.filter((ackErro) =>
        error.menssage.includes(ackErro),
      );

      if (filterAckERror) await channel.ack(originMessage);
    }
  }
}
