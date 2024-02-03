import { Body, Controller, Get, HttpCode, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { StartGameDto, StartGameResponseDto } from './dto/startGame.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @Render('pages/index')
  home(): void {}

  @Post('/start')
  @Render('pages/start')
  @HttpCode(200)
  async startGame(@Body() body: StartGameDto): Promise<StartGameResponseDto> {
    return this.appService.startGame(body);
  }
}
