export class StartGameDto {
  player: string;
}

export class StartGameResponseDto {
  name: string;
  sessionId: string;
  gameId: string;
  seed: number;
}
