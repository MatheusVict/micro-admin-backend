import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayerInterface } from './interface/players/players.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('players')
    private readonly playersModel: Model<PlayerInterface>,
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  async createPlayer(player: PlayerInterface): Promise<void> {
    try {
      const playerCreated = new this.playersModel(player);
      await playerCreated.save();
    } catch (error) {
      this.logger.error(`Erro: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async findAll(): Promise<PlayerInterface[]> {
    try {
      return await this.playersModel.find().populate('category');
    } catch (error) {
      this.logger.error(`Erro: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async findOne(id: string): Promise<PlayerInterface> {
    try {
      return await (await this.playersModel.findById(id)).populate('category');
    } catch (error) {
      this.logger.error(`Erro: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async updatePlayer(_id: string, data: PlayerInterface): Promise<void> {
    try {
      await this.playersModel.findOneAndUpdate({ _id }, { $set: data });
    } catch (error) {
      this.logger.error(`Erro: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async deletePlayer(_id: string): Promise<void> {
    try {
      await this.playersModel.deleteOne({ _id });
    } catch (error) {
      this.logger.error(`Erro: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
