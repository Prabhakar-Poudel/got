import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

interface Move {
  sessionId: string;
  additive: -1 | 0 | 1;
  result: number;
}

interface JoinEvent {
  gameId: string;
  sessionId: string;
  seed: number;
}

interface MoveEvent {
  gameId: string;
  seed: number;
  sessions: string[];
  moves: Move[];
}

enum EventType {
  MOVE = 'move',
  BEGIN = 'begin',
  JOIN = 'join',
}

@WebSocketGateway()
export class EventGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage(EventType.MOVE)
  gameMove(@MessageBody() data: MoveEvent): void {
    console.log('moving game');
    this.server.to(data.gameId).emit(EventType.MOVE, data);
  }

  @SubscribeMessage(EventType.BEGIN)
  gameBegin(@MessageBody() data: MoveEvent): void {
    console.log('starting game');
    this.server.to(data.gameId).emit(EventType.MOVE, data);
  }

  @SubscribeMessage(EventType.JOIN)
  joinGame(socket: Socket, data: JoinEvent): JoinEvent {
    console.log('joining game', data);
    socket.to(data.gameId).emit(EventType.JOIN, data);
    socket.join(data.gameId);
    console.log(socket.rooms);
    return data;
  }
}
