import _ from 'lodash';
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
    if (canvas) {
      renderCanvas(canvas);
    }
  }

  componentDidUpdate(prevProps: CanvasProps) {
    const {
      canvasRef,
      renderCanvas,
      props: {
        points: pointsNext,
      },
    } = this;

    const {
      points: pointsPrev,
    } = prevProps;

    if (!_.isEqual(pointsNext, pointsPrev)) {
      const canvas = canvasRef.current;
      if (canvas) {
        renderCanvas(canvas);
      }
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

  renderCanvas = (canvas: HTMLCanvasElement) => {
    const {
      delaunay,
      voronoi,
      props: {
        height,
        width,
      },
    } = this;

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    context.clearRect(0, 0, width, height);

    context.beginPath();
    context.fillStyle = '#eee';
    context.strokeStyle = 'black';
    voronoi.renderBounds(context);
    context.stroke();
    context.fill();

    context.setLineDash([6, 2]);
    context.beginPath();
    context.fillStyle = 'transparent';
    context.strokeStyle = 'lightblue';
    delaunay.render(context);
    context.stroke();
    context.fill();

    context.setLineDash([1, 0]);
    context.beginPath();
    context.fillStyle = 'transparent';
    context.strokeStyle = 'black';
    voronoi.render(context);
    context.stroke();
    context.fill();

    context.beginPath();
    context.fillStyle = 'blue';
    context.strokeStyle = 'transparent';
    delaunay.renderPoints(context);
    context.stroke();
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
