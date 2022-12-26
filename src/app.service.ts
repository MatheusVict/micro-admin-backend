import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayerInterface } from './interface/players/players.interface';
import { CategoriesInterface } from './interface/categories/categories.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('players')
    private readonly playerModel: Model<PlayerInterface>,
    @InjectModel('categories')
    private readonly categoriesModel: Model<CategoriesInterface>,
  ) {}

  private readonly logger = new Logger(AppService.name);

  async createCategory(
    category: CategoriesInterface,
  ): Promise<CategoriesInterface> {
    try {
      const categoryCreate = new this.categoriesModel(category);

      return await categoryCreate.save();
    } catch (error) {
      this.logger.error(`Erro: ${error.menssage}`);
      throw new RpcException(error.message);
    }
  }

  async getOne(id: string): Promise<CategoriesInterface> {
    try {
      const category = await this.categoriesModel.findById(id);
      if (!category) throw new RpcException('categoria não encontrada');

      return category;
    } catch (error) {
      this.logger.log(`Error: ${error.menssage}`);
      throw new RpcException(error.message);
    }
  }

  async findAll(): Promise<CategoriesInterface[]> {
    try {
      return await this.categoriesModel.find();
    } catch (error) {
      this.logger.log(`Error: ${error.menssage}`);
      throw new RpcException(error.message);
    }
  }

  async updateCategory(_id: string, category: CategoriesInterface) {
    try {
      await this.categoriesModel.findOneAndUpdate({ _id }, { $set: category });
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.menssage)}`);
      throw new RpcException(`Erro ao atualizar: ${error.message}`);
    }
  }
}
