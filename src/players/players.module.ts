import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { PlayerSchema } from './interface/players/player.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'players', schema: PlayerSchema }]),
  ],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
