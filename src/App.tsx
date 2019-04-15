import { Delaunay } from "d3-delaunay";
import React, { Component } from 'react';

import './App.css';

import Canvas from './Canvas';

class App extends Component {
  canvasRef = React.createRef<HTMLCanvasElement>();

  width = 600;

  height = 600;

  points = [
    [100, 100],
    [100, 500],
    [300, 300],
    [500, 100],
    [500, 500],
  ];

  render() {
    const {
      canvasRef,
      height,
      points,
      width,
    } = this;

    return (
      <div className="App">
        <Canvas
          height={height}
          points={points}
          width={width}
        />
      </div>
    );
  }
}

export default App;
