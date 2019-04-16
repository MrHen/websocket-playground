import _ from 'lodash';
import React, { Component } from 'react';

import './App.css';

import Canvas from './Canvas';

interface AppState {
  mouseX: number | null;
  mouseY: number | null;
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

  state = {
    mouseX: null,
    mouseY: null,
  };

  onMouseMove: React.MouseEventHandler = (event) => {
    const {
      offsetLeft,
      offsetTop,
    } = (event.target as HTMLCanvasElement);

    this.setState({
         mouseX: event.clientX - offsetLeft,
         mouseY: event.clientY - offsetTop,
    });
  }

  get points() {
    const {
      anchors,
      state: {
        mouseX,
        mouseY,
      },
    } = this;

    const points = [
      ...anchors,
    ];

    if (mouseX && mouseY) {
      points.push([mouseX, mouseY]);
    }

    return points;
  }

  render() {
    const {
      height,
      onMouseMove,
      points,
      width,
    } = this;

    return (
      <div
        className="App"
      >
        <div
          className="Canvas-Container"
          onMouseMove={onMouseMove}
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
