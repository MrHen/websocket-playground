import _ from 'lodash';
import { Delaunay } from "d3-delaunay";
import { interpolateRainbow } from 'd3-scale-chromatic';
import React, { Component } from 'react';

import './App.css';

interface CanvasPoint {
  x: number;
  y: number;
}

interface CanvasProps {
  height: number;
  points: CanvasPoint[];
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

    function x(point: CanvasPoint) {
      return point.x;
    }

    function y(point: CanvasPoint) {
      return point.y;
    }

    return Delaunay.from(points, x, y);
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

    const maxColors = delaunay.points.length;

    for (let p in delaunay.points) {
      const i = Number(p);
      const color = i / maxColors;

      context.beginPath();
      context.fillStyle = interpolateRainbow(color);
      voronoi.renderCell(i, context);
      context.stroke();
      context.fill();
    }

    context.setLineDash([1, 0]);
    context.beginPath();
    context.lineWidth = 2;
    context.fillStyle = 'transparent';
    context.strokeStyle = '#333';
    voronoi.render(context);
    context.stroke();
    context.fill();

    context.beginPath();
    context.lineWidth = 2;
    context.fillStyle = '#333';
    context.strokeStyle = '#333';
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
