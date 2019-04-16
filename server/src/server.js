const _ = require('lodash');
const uuid = require('uuid/v4');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const ACTIONS = {
  START: 'start',
  MOVE: 'move',
};

const PLAYER_TYPES = {
  HUMAN: 'human',
  STATIC: 'static',
};

const players = {};

function playerInit() {
  const id = uuid();
  const player = {
    id,
    x: null,
    y: null,
  };
  players[id] = player;
  return player;
}

wss.on('connection', (client) => {
  const player = playerInit();

  client.on('close', () => {
    delete players[player.id];

    wss.clients.forEach(function each(clientNext) {
      if (client !== clientNext && clientNext.readyState === WebSocket.OPEN) {
        clientNext.send(json);
      }
    });
  });

  client.on('message', (payload) => {
    let message;
    try {
      message = JSON.parse(payload);
    } catch (ex) {
      message = payload;
    }

    switch(message.action) {
      case ACTIONS.MOVE: {
        player.x = message.playerX;
        player.y = message.playerY;
      }
    }

    const response = {
      action: message.action,
      playerId: player.id,
      players,
    };
    const json = JSON.stringify(response);

    wss.clients.forEach(function each(clientNext) {
      if (clientNext.readyState === WebSocket.OPEN) {
        clientNext.send(json);
      }
    });
  });

  const response = {
    action: ACTIONS.START,
    playerId: player.id,
    players,
  };
  const json = JSON.stringify(response);
  client.send(json);
});
