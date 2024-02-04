import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StartGameDto, StartGameResponseDto } from './dto/startGame.dto';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('home', () => {
    it('should render the index page and has no data', async () => {
      const renderSpy = jest.spyOn(appController, 'home');
      const response = await appController.home();
      expect(renderSpy).toHaveBeenCalled();
      expect(response).toEqual(undefined);
    });
  });

  describe('startGame', () => {
    it('should render the start page with required data', async () => {
      const startGameDto: StartGameDto = { player: 'John' };
      const expectedResponse: StartGameResponseDto = {
        name: 'John',
        sessionId: expect.any(String),
        gameId: expect.any(String),
        seed: expect.any(Number),
      };

      jest.spyOn(appService, 'startGame').mockResolvedValue(expectedResponse);

      const renderSpy = jest.spyOn(appController, 'startGame');
      const response = await appController.startGame(startGameDto);

      expect(renderSpy).toHaveBeenCalledWith(startGameDto);
      expect(response).toEqual(expectedResponse);
    });
  });
});
