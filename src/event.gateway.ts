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

export interface JoinEvent {
  gameId: string;
  sessionId: string;
}

export interface MoveEvent {
  gameId: string;
  seed: number;
  sessions: string[];
  moves: Move[];
}

export enum EventType {
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
    this.server.to(data.gameId).emit(EventType.MOVE, data);
  }

  @SubscribeMessage(EventType.BEGIN)
  gameBegin(@MessageBody() data: MoveEvent): void {
    this.server.to(data.gameId).emit(EventType.MOVE, data);
  }

  @SubscribeMessage(EventType.JOIN)
  joinGame(socket: Socket, data: JoinEvent): JoinEvent {
    socket.to(data.gameId).emit(EventType.JOIN, data);
    socket.join(data.gameId);
    return data;
  }
}
