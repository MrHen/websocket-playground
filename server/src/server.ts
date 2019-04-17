import { v4 as uuid } from 'uuid';
import * as WebSocket from 'ws';

interface Action {
  action: string;
  playerX?: number | null;
  playerY?: number | null;
}

const wss = new WebSocket.Server({port: 8080});

const ACTIONS = {
  START: 'start',
  MOVE: 'move'
};

const players = {};

function playerInit() {
  const id = uuid();
  const player = {
    id,
    x: null,
    y: null
  };
  players[id] = player;
  return player;
}

wss.on('connection', client => {
  const player = playerInit();

  client.on('close', () => {
    delete players[player.id];

    wss.clients.forEach(clientNext => {
      if (client !== clientNext && clientNext.readyState === WebSocket.OPEN) {
        clientNext.send(json);
      }
    });
  });

  client.on('message', (payload: string) => {
    let message: Action;
    try {
      message = JSON.parse(payload);
    } catch (error) {
      message = {
        action: payload,
      };
    }

    switch (message.action) {
      case ACTIONS.MOVE: {
        player.x = message.playerX;
        player.y = message.playerY;
        break;
      }

      default: {
        console.warn('Ignoring unknown action', {
          action: message.action
        });
      }
    }

    const response = {
      action: message.action,
      playerId: player.id,
      players
    };
    const json = JSON.stringify(response);

    wss.clients.forEach(clientNext => {
      if (clientNext.readyState === WebSocket.OPEN) {
        clientNext.send(json);
      }
    });
  });

  const response = {
    action: ACTIONS.START,
    playerId: player.id,
    players
  };
  const json = JSON.stringify(response);
  client.send(json);
});
