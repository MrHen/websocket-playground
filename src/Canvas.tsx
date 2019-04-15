import { Delaunay } from "d3-delaunay";
import React, { Component } from 'react';

import './App.css';

interface CanvasProps {
  height: number;
  points: number[][];
  width: number;
}

class Canvas extends Component<CanvasProps> {
  canvasRef = React.createRef<HTMLCanvasElement>();

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
      props: {
        points,
      },
    } = this;

    return Delaunay.from(points);
  }

  get voronoi() {
    const {
      delaunay,
      props: {
        height,
        width,
      },
    } = this;

    return delaunay.voronoi([0, 0, width, height]);
  }

  renderCanvas = (context: CanvasRenderingContext2D) => {
    const {
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
      props: {
        height,
        width,
      },
    } = this;

    return (
      <div className="Canvas">
        <canvas
          ref={canvasRef}
          height={height}
          width={width}
        />
      </div>
    );
  }
}

export default Canvas;
