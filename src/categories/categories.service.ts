import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesInterface } from 'src/categories/interfaces/categories/categories.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('categories')
    private readonly categoriesModel: Model<CategoriesInterface>,
  ) {}

  private readonly logger = new Logger(CategoriesService.name);

  async createCategory(
    category: CategoriesInterface,
  ): Promise<CategoriesInterface> {
    try {
      const categoryCreate = new this.categoriesModel(category);

      return await categoryCreate.save();
    } catch (error) {
      this.logger.error(`Erro: ${error.message}`);
      throw new RpcException(error.message);
    }
  }

  async getOne(_id: string): Promise<CategoriesInterface> {
    try {
      return await this.categoriesModel.findOne({ _id });
    } catch (error) {
      this.logger.log(`Error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async findAll(): Promise<CategoriesInterface[]> {
    try {
      return await this.categoriesModel.find();
    } catch (error) {
      this.logger.log(`Error: ${error.message}`);
      throw new RpcException(error.message);
    }
  }

  async updateCategory(_id: string, category: CategoriesInterface) {
    try {
      await this.categoriesModel.findOneAndUpdate({ _id }, { $set: category });
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);
      throw new RpcException(`Erro ao atualizar: ${error.message}`);
    }
  }

  async delete(_id: string): Promise<void> {
    try {
      await this.categoriesModel.deleteOne({ _id });
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }
}
