import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriesInterface } from './interface/categories/categories.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @EventPattern('criar-categoria')
  async createCategory(@Payload() category: CategoriesInterface) {
    this.logger.log(`categoria: ${JSON.stringify(category)}`);
    await this.appService.createCategory(category);
  }

  @MessagePattern('pegar-categoria')
  async getOne(@Payload() _id: string) {
    if (_id) {
      return await this.appService.getOne(_id);
    } else {
      return await this.appService.findAll();
    }
  }
}
