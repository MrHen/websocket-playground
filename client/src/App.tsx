import _ from 'lodash';
import React, { Component } from 'react';

import './App.css';

import Canvas from './Canvas';

const ACTIONS = {
  MOVE: 'move',
  START: 'start',
}

const WEBSOCKET_ENDPOINT = 'ws://0.0.0.0:8080';

interface PlayerState {
  id: string;
  x: number | null;
  y: number | null;
}

interface AppState {
  mouseX: number | null;
  mouseY: number | null;
  playerId: string | null;
  players: PlayerState[],
  websocket: WebSocket | null;
}

class App extends Component<{}, AppState> {
  width = 600;

  height = 600;

  anchors = [
    [100, 100],
    [100, 500],
    [300, 300],
    [500, 100],
    [500, 500],
  ];

  state: AppState = {
    mouseX: null,
    mouseY: null,
    playerId: null,
    players: [],
    websocket: null,
  };

  websocket: WebSocket | null = null;

  componentDidMount() {
    const websocket = new WebSocket(WEBSOCKET_ENDPOINT);
    websocket.onopen = this.handleOnOpen;
    websocket.onmessage = this.handleOnMessage;
    websocket.onerror = this.handleOnError;
    websocket.onclose = this.handleOnClose;

    this.websocket = websocket;
  }

  handleOnClose = (event: CloseEvent) => {
    console.log('handleOnClose', { event });
  }

  handleOnOpen = () => {
    console.log('handleOnOpen');
  }

  handleOnError = (event: Event) => {
    console.log('handleOnError', { event });
  }

  handleOnMessage = (event: MessageEvent) => {
    let message;
    try {
      message = JSON.parse(event.data);
    } catch (ex) {
      message = event.data;
    }

    switch(message.action) {
      case ACTIONS.START: {
        this.setState({
          playerId: message.playerId,
          players: _.values(message.players),
          websocket: this.websocket,
        });
        break;
      }
      case ACTIONS.MOVE: {
        this.setState({
          players: _.values(message.players),
        });
        break;
      }
    }
  }

  handleMouseMove: React.MouseEventHandler = (event) => {
    const {
      state: {
        playerId,
        websocket,
      },
    } = this;

    const {
      offsetLeft,
      offsetTop,
    } = (event.target as HTMLCanvasElement);

    const x = event.clientX - offsetLeft;
    const y = event.clientY - offsetTop;

    this.setState({
      mouseX: event.clientX - offsetLeft,
      mouseY: event.clientY - offsetTop,
    });

    if (websocket) {
      const message = {
        action: ACTIONS.MOVE,
        playerId,
        playerX: x,
        playerY: y,
      };
      const json = JSON.stringify(message);
      websocket.send(json);
    }
  }

  get points() {
    const {
      anchors,
      state: {
        players,
      },
    } = this;

    const points = _.map(anchors, (anchor) => {
      return {
        x: anchor[0],
        y: anchor[1],
      };
    });

    for (let player of players) {
      if (player.x && player.y) {
        points.push({
          x: player.x,
          y: player.y,
        });
      }
    }

    return points;
  }

  render() {
    const {
      height,
      handleMouseMove,
      points,
      width,
    } = this;

    return (
      <div
        className="App"
      >
        <div
          className="Canvas-Container"
          onMouseMove={handleMouseMove}
          style={{
            height,
            width,
          }}
        >
          <Canvas
            height={height}
            points={points}
            width={width}
          />
        </div>
      </div>
    );
  }
}

export default App;
