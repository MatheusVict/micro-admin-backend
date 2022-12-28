import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './interfaces/categories/categories.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'categories', schema: CategorySchema }]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
