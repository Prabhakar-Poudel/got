import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

describe('AppController (e2e)', () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setViewEngine('hbs');
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .then((response) => {
        expect(response.text).toContain('Game of Three');
        expect(response.text).toContain('Play');
      });
  });

  it('/start (POST)', () => {
    return request(app.getHttpServer())
      .post('/start')
      .send({ player: 'John' })
      .expect(200)
      .then((response) => {
        expect(response.text).toContain('Game of Three');
        expect(response.text).toContain('Hello John');
      });
  });
});
