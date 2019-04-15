import { Delaunay } from "d3-delaunay";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import logo from './logo.svg';
import './App.css';

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

  componentDidMount() {
    const {
      canvasRef,
      renderCanvas,
    } = this;

    const canvas = canvasRef.current;
    let context = null;

    if (canvas) {
      context = canvas.getContext('2d');
    }

    if (context) {
      renderCanvas(context);
    }
  }

  get delaunay() {
    const {
      points,
    } = this;

    return Delaunay.from(points);
  }

  get voronoi() {
    const {
      delaunay,
      height,
      points,
      width,
    } = this;

    return delaunay.voronoi([0, 0, width, height]);
  }

  renderCanvas = (context: CanvasRenderingContext2D) => {
    const {
      canvasRef,
      delaunay,
      voronoi,
    } = this;

    console.log('renderCanvas started', {
      context,
      delaunay,
      voronoi,
    });

    context.setLineDash([6, 2]);
    context.beginPath();
    context.strokeStyle = 'lightblue';
    delaunay.render(context);
    context.stroke();

    context.setLineDash([1, 0]);
    context.beginPath();
    context.strokeStyle = 'black';
    voronoi.render(context);
    context.stroke();

    context.beginPath();
    context.fillStyle = 'blue';
    delaunay.renderPoints(context);
    context.fill();
  }

  render() {
    const {
      canvasRef,
      height,
      width,
    } = this;

    return (
      <div className="App">
        <canvas
          ref={canvasRef}
          height={height}
          width={width}
        />
      </div>
    );
  }
}

export default App;
