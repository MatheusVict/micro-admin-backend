import { Controller, Logger } from '@nestjs/common';
import { PlayersService } from './players.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { PlayerInterface } from './interface/players/players.interface';

const ackErros: string[] = ['E11000'];

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  private readonly logger = new Logger(PlayersController.name);

  @EventPattern('criar-jogador')
  async createPLayer(
    @Payload() player: PlayerInterface,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();

    try {
      this.logger.log(`createPlayer: ${JSON.stringify(player)}`);
      await this.playersService.createPlayer(player);
      await channel.ack(originMessage);
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.name)}`);
      const filterAckError = ackErros.filter((ackErro) =>
        error.message.includes(ackErro),
      );

      if (filterAckError) await channel.ack(originMessage);
    }
  }

  @MessagePattern('consultar-jogador')
  async getPLayers(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();

    try {
      if (id) return await this.playersService.findOne(id);

      return await this.playersService.findAll();
    } finally {
      await channel.ack(originMessage);
    }
  }

  @EventPattern('atualizar-jogador')
  async updatePlayer(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();

    try {
      this.logger.log(`updatePlayer: ${JSON.stringify(data)}`);
      const id: string = data.id;
      const body: PlayerInterface = data.body;
      await this.playersService.updatePlayer(id, body);
      await channel.ack(originMessage);
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.menssage)}`);
      const filterAckError = ackErros.filter((ackErro) =>
        error.menssage.includes(ackErro),
      );

      if (filterAckError) await channel.ack(originMessage);
    }
  }

  @EventPattern('deletar-jogador')
  async deletePlayer(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();

    try {
      await this.playersService.deletePlayer(id);
      await channel.ack(originMessage);
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErros.filter((ackErro) =>
        error.message.includes(ackErro),
      );

      if (filterAckError) await channel.ack(originMessage);
    }
  }
}
