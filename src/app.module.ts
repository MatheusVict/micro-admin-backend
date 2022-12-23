import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './interface/categories/categories.schema';
import { PlayerSchema } from './interface/players/player.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_CONNECTION, {
      autoCreate: true,
      autoIndex: true,
    }),
    MongooseModule.forFeature([
      { name: 'categories', schema: CategorySchema },
      { name: 'players', schema: PlayerSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
