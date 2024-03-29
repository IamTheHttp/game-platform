/**
 * Library for working with Canvas,
 * Works by using a 2D context as an argument
 * Provides abstraction for some common shapes in Canvas
 */

import {Circle, Shape} from './Shapes/Shape';

import {
  ILayers,
  IRect,
  IWriteToCanvas,
  IPanOffset,
  ICircle,
  IArc,
  IWriteTextBubble,
  IAddImageData
} from '../interfaces';

export class Painter {
  layers: ILayers;
  defaultStrokeStyle: 'white' | 'green' | 'color' | string; // alias to color
  panX: number;
  panY: number;

  constructor(ctx: CanvasRenderingContext2D, strokeStyle = 'white') {
    if (!ctx) {
      throw 'Cannot create layer, no initial context found';
    }
    this.layers = {
      initial: {
        ctx,
        shapes: new Map()
      }
    };

    this.defaultStrokeStyle = strokeStyle;
    ctx.strokeStyle = strokeStyle;
  }

  /**
   * Add another layer that can be used for drawAllShapesInLayering.
   * Internally this clones the existing canvas.
   * @param name
   */
  addLayer(name: string) {
    let originCanvas = this.layers.initial.ctx.canvas;

    let parentNode = originCanvas.parentNode;
    let newCanvas = originCanvas.cloneNode() as HTMLCanvasElement;

    newCanvas.id = name;
    parentNode.insertBefore(newCanvas, originCanvas);

    this.layers[name] = {
      ctx: newCanvas.getContext('2d'),
      shapes: new Map()
    };
  }

  removeLayer(name: string) {
    let originCanvas = this.layers.initial.ctx.canvas;
    let parentNode = originCanvas.parentNode;

    parentNode.querySelector(`#${name}`).remove();
    delete this.layers[name];
  }

  clearAllShapesInLayer(layerName = 'initial') {
    let layer = this.layers[layerName];
    layer.shapes = new Map();
  }

  clearAllLayers() {
    for (let layerName in this.layers) {
      if (!this.layers.hasOwnProperty(layerName)) {
        continue;
      }
      this.clearAllShapesInLayer(layerName);
    }
  }

  removeShapeByID(id: string, layerName = 'initial') {
    let layer = this.layers[layerName];
    let shapes = layer.shapes;
    shapes.delete(id);
  }

  /* istanbul ignore next */
  drawImage({
    id,
    image, // the image to display
    x,
    y, // pos for x,y..
    height,
    width,
    cropStartX,
    cropStartY,
    cropSizeX,
    cropSizeY,
    rotation, // in radians
    layerName = 'initial'
  }: IAddImageData) {
    let layer = this.layers[layerName];
    let ctx = layer.ctx;
    let shapes = layer.shapes;

    shapes.set(
      id,
      new Shape(
        () => {
          ctx.beginPath();
          ctx.save();
          ctx.translate(x + width / 2, y + height / 2);
          ctx.rotate(rotation);
          ctx.drawImage(
            image,
            cropStartX,
            cropStartY,
            cropSizeX,
            cropSizeY,
            -width / 2,
            -height / 2, // pos in canvas // at the top left of the canvas
            width,
            height
          ); // size in canvas
          ctx.restore();
          ctx.closePath();
        },
        {
          id,
          type: 'image',
          x,
          y,
          height,
          width
        }
      )
    );
  }

  addShape({id, render, layerName = 'initial'}: Shape) {
    let layer = this.layers[layerName];
    let ctx = layer.ctx;
    let shapes = layer.shapes;

    shapes.set(
      id,
      new Shape(() => {
        render(ctx);
      })
    );
  }

  drawTextBubble({
    id,
    text,
    backgroundColor,
    borderColor,
    borderWidth,
    fontSize,
    fontColor,
    x,
    y,
    fontFace,
    height,
    width,
    paddingLeft = 10,
    paddingTop = 10,
    layerName = 'initial'
  }: IWriteTextBubble) {
    let longestTextWidth = 0;
    let linesOfText = text.split('\n');
    let fontPxSize = fontSize || +this.layers.initial.ctx.font.split('px')[0];
    let fontToUse = fontFace || +this.layers.initial.ctx.font.split('px')[1];

    // set it first for text-width calculations
    this.layers.initial.ctx.font = `${fontPxSize}px ${fontToUse}`;

    for (let i = 0; i < linesOfText.length; i++) {
      let {width} = this.layers[layerName].ctx.measureText(linesOfText[i]);
      longestTextWidth = width > longestTextWidth ? width : longestTextWidth;
    }

    this.drawRect({
      id: `${id}`,
      x,
      y,
      height: Math.max(height, linesOfText.length * fontPxSize + paddingTop * 2),
      width: Math.max(width, longestTextWidth + paddingLeft * 2 + borderWidth),
      fillColor: backgroundColor,
      lineWidth: borderWidth,
      strokeStyle: borderColor,
      layerName
    });

    for (let i = 0; i < linesOfText.length; i++) {
      this.drawText({
        id: `${id}-bubbleText-${i}`,
        text: linesOfText[i],
        x: x + paddingLeft,
        y: y + fontPxSize + paddingTop + i * fontPxSize,
        fillStyle: fontColor,
        font: `${fontPxSize}px ${fontToUse}`,
        layerName,
        textBaseline: null,
        strokeStyle: null,
        color: null
      });
    }
  }

  drawRect({id, x, y, width, height, strokeStyle, color, lineWidth, fillColor, layerName}: IRect) {
    let layer = this.layers[layerName || 'initial'];
    if (!layer) {
      throw `Could not find layer '${layerName}', are you sure you created the layer?`;
    }

    let ctx = layer.ctx;
    let shapes = layer.shapes;

    shapes.set(
      id,
      new Shape(
        () => {
          ctx.strokeStyle = strokeStyle || color;
          ctx.lineWidth = lineWidth;
          ctx.beginPath();
          ctx.rect(x, y, width, height);
          if (fillColor) {
            ctx.fillStyle = fillColor;
            ctx.fill();
          }
          ctx.stroke();
          ctx.closePath();
        },
        {
          id,
          type: 'rect',
          x,
          y,
          height,
          width
        }
      )
    );
  }

  drawArc({
    id,
    direction,
    size,
    color = 'black',
    strokeStyle = 'black',
    fillColor,
    lineWidth = 1,
    x,
    y,
    radius,
    layerName = 'initial'
  }: IArc) {
    let layer = this.layers[layerName];
    let ctx = layer.ctx;
    let shapes = layer.shapes;

    shapes.set(
      id,
      new Shape(() => {
        ctx.strokeStyle = strokeStyle || color;
        ctx.lineWidth = lineWidth;

        let startArc = direction - size / 2;
        let endArc = direction + size / 2;

        ctx.beginPath();
        ctx.arc(x, y, radius, startArc * Math.PI, endArc * Math.PI);
        if (fillColor) {
          ctx.fillStyle = fillColor;
          ctx.fill();
        }
        ctx.stroke();
        ctx.closePath();
      })
    );
  }

  drawCircle(circleData: ICircle) {
    let layer = this.layers[circleData.layerName || 'initial'];
    let ctx = layer.ctx;
    let shapes = layer.shapes;

    shapes.set(circleData.id, new Circle(circleData, ctx));
  }

  /**
   * Method allows us to pan around the canvas
   */
  panCamera(x: number, y: number) {
    this.panX = x;
    this.panY = y;

    for (let layerName in this.layers) {
      if (!this.layers.hasOwnProperty(layerName)) {
        continue;
      }
      let layer = this.layers[layerName];
      let ctx = layer.ctx;
      ctx.setTransform(1, 0, 0, 1, x, y);

      // non initial layers are drawn much less often, so we need a manual one here.
      if (layerName !== 'initial') {
        this.drawAllShapesInLayer(layerName); // pan requires a draw to all non initial layers
      }
    }
  }

  getCurrentPanValue(): IPanOffset {
    return {
      panX: this.panX || 0,
      panY: this.panY || 0
    };
  }

  drawText({
    id,
    text,
    x,
    y,
    font = '',
    textBaseline,
    fillStyle,
    strokeStyle = '',
    color = '',
    layerName = 'initial'
  }: IWriteToCanvas) {
    let layer = this.layers[layerName];
    let ctx = layer.ctx;
    let shapes = layer.shapes;
    shapes.set(
      id,
      new Shape(
        () => {
          ctx.beginPath();
          ctx.font = font;
          ctx.textBaseline = textBaseline;
          ctx.fillStyle = fillStyle;
          ctx.strokeStyle = strokeStyle || color;
          ctx.fillText(text, x, y);
          ctx.closePath();
        },
        {
          id,
          x,
          y
        }
      )
    );
  }

  drawAllShapesInLayer(layerName = 'initial') {
    let layer = this.layers[layerName];
    let ctx = layer.ctx;
    let shapes = layer.shapes;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();

    for (let shape of shapes.values()) {
      shape.render(ctx);
      ctx.strokeStyle = this.defaultStrokeStyle;
    }
  }
}

// adding an image causes segmentation fault for some reason.
/* istanbul ignore next */
if (process.env.NODE_ENV === 'test') {
  Painter.prototype.drawImage = () => {};
}
