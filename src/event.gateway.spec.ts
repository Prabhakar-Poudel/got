import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { JoinEvent, MoveEvent } from './event.gateway';
import { AppModule } from './app.module';

describe('EventGateway', () => {
  let socket: Socket;
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.listen(3500);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach((done) => {
    socket = io('http://localhost:3500');
    socket.on('connect', () => {
      done();
    });
  });

  afterEach(() => {
    socket.disconnect();
  });

  it('should receive join event', (done) => {
    const joinEvent: JoinEvent = {
      gameId: 'game1',
      sessionId: 'session1',
    };

    socket.emit('join', joinEvent, (response) => {
      expect(response).toEqual(joinEvent);
      done();
    });
  });

  it('should receive begin event and send move event', (done) => {
    const moveEvent: MoveEvent = {
      gameId: 'game1',
      seed: 123,
      sessions: ['session1', 'session2'],
      moves: [{ sessionId: 'session1', additive: 0, result: 123 }],
    };
    socket.emit('join', {
      gameId: 'game1',
      sessionId: 'session1',
    });

    socket.on('move', (data) => {
      expect(data).toEqual(moveEvent);
      done();
    });
    socket.emit('begin', moveEvent);
  });

  it('should receive move event and emit move event', (done) => {
    const moveEvent: MoveEvent = {
      gameId: 'game1',
      seed: 123,
      sessions: ['session1', 'session2'],
      moves: [
        { sessionId: 'session1', additive: 0, result: 123 },
        { sessionId: 'session2', additive: 0, result: 41 },
      ],
    };

    socket.emit('join', {
      gameId: 'game1',
      sessionId: 'session1',
    });

    socket.on('move', (data) => {
      expect(data).toEqual(moveEvent);
      done();
    });
    socket.emit('move', moveEvent);
  });
});
