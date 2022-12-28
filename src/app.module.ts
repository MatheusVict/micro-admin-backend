import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_CONNECTION, {
      autoCreate: true,
      autoIndex: true,
    }),
    CategoriesModule,
    PlayersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
