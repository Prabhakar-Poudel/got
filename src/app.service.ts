import { Inject, Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { StartGameDto, StartGameResponseDto } from './dto/startGame.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

const MAX_SEED = 100000;

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async startGame(body: StartGameDto): Promise<StartGameResponseDto> {
    const game = await this.getGame();
    return {
      name: body.player,
      sessionId: nanoid(),
      gameId: game,
      seed: this.getRandomInt(),
    };
  }

  private;

  async getGame(): Promise<string> {
    let game = await this.cacheManager.get<string | null>('availableGame');
    if (game) {
      await this.cacheManager.del('availableGame');
      return game;
    }

    game = nanoid();
    await this.cacheManager.set('availableGame', game, 0);

    return game;
  }

  getRandomInt(max = MAX_SEED): number {
    return Math.floor(Math.random() * max);
  }
}
