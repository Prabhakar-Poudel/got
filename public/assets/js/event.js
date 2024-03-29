const DELAY_MOVE_MS = 2000;
const MAX_SEED = 100000;
const EVENTS = {
  JOIN: 'join',
  BEGIN: 'begin',
  MOVE: 'move',
};

let gameId;
let sessionId;

const socket = io();

socket.on(EVENTS.MOVE, (data) => {
  handleMove(data);
});

socket.once(EVENTS.JOIN, (data) => {
  startGame(data);
});

const startGame = (data) => {
  const seedText = document.getElementById('seed').textContent;
  const seed = seedText
    ? parseInt(seedText, 10)
    : Math.floor(Math.random() * MAX_SEED);

  const sessions = [data.sessionId, sessionId];
  const moves = [{ sessionId, additive: 0, result: seed }];
  setTimeout(
    () => socket.emit(EVENTS.BEGIN, { sessions, moves, gameId, seed }),
    DELAY_MOVE_MS,
  );
};

const handleMove = (data) => {
  const moves = data.moves;
  const resultEl = document.getElementById('result');
  const lastMove = moves.at(-1);

  resultEl.appendChild(createChatMessage(lastMove));
  if (lastMove.result === 1) {
    disconnect();
    showFinishedGame(lastMove.sessionId === sessionId);
    return;
  }
  if (lastMove.sessionId !== sessionId) {
    makeAMove(data, lastMove);
  }
};

const makeAMove = (data, lastMove) => {
  const additive = getAdditive(lastMove.result);
  const result = (lastMove.result + additive) / 3;
  const newMoves = [...data.moves, { sessionId, additive, result }];
  setTimeout(
    () => socket.emit(EVENTS.MOVE, { ...data, moves: newMoves }),
    DELAY_MOVE_MS,
  );
};

const getAdditive = (lastNumber) => {
  const reminder = lastNumber % 3;
  switch (reminder) {
    case 0:
      return 0;
    case 1:
      return -1;
    case 2:
      return 1;
  }
};

const disconnect = () => {
  socket.disconnect();
};

const init = async () => {
  sessionId = document.getElementById('sessionId').textContent;
  gameId = document.getElementById('gameId').textContent;
  if (!sessionId || !gameId) {
    disconnect();
    return;
  }
  socket.emit(EVENTS.JOIN, { sessionId, gameId });
};

document.addEventListener('DOMContentLoaded', init);

const createChatMessage = (move) => {
  const isSelf = move.sessionId === sessionId;
  const message = `Additive: ${move.additive}, Result: ${move.result}`;

  const messageContainer = document.createElement('div');
  messageContainer.classList.add(
    'flex',
    'flex-col',
    'mb-4',
    isSelf ? 'items-end' : 'items-start',
  );

  const senderName = document.createElement('p');
  senderName.classList.add('text-xs', 'text-gray-300', 'mb-1');
  senderName.textContent = isSelf ? 'You' : move.sessionId;
  messageContainer.appendChild(senderName);

  const messageDiv = document.createElement('div');
  messageDiv.classList.add(
    'bg-' + (isSelf ? 'green-500' : 'blue-500'),
    'text-white',
    'p-3',
    'rounded-lg',
    'w-2/5',
  );
  messageDiv.textContent = message;
  messageContainer.appendChild(messageDiv);

  return messageContainer;
};

const showFinishedGame = (didWin) => {
  const messageEl = document.createElement('p');
  messageEl.classList.add('text-9xl', 'mb-1', 'flex', 'justify-center');
  messageEl.textContent = didWin ? '🎉' : '☹️';

  const resultEl = document.getElementById('result');
  resultEl.prepend(messageEl);
};
