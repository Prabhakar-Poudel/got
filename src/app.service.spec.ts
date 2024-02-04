import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AppService, MAX_SEED } from './app.service';
import { StartGameDto, StartGameResponseDto } from './dto/startGame.dto';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  describe('startGame', () => {
    it('should return a StartGameResponseDto', async () => {
      const startGameDto: StartGameDto = {
        player: 'John',
      };

      const expectedResult: StartGameResponseDto = {
        name: 'John',
        sessionId: expect.any(String),
        gameId: expect.any(String),
        seed: expect.any(Number),
      };

      const result = await appService.startGame(startGameDto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getGame', () => {
    it('should return a string', async () => {
      const result = await appService.getGame();

      expect(typeof result).toBe('string');
    });
  });

  describe('getRandomInt', () => {
    it('should return a random number within the specified range', () => {
      const max = 100;

      const result = appService.getRandomInt(max);

      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(max);
    });

    it('should return a random number within the default range if no max value is provided', () => {
      const result = appService.getRandomInt();

      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(MAX_SEED);
    });
  });
});
