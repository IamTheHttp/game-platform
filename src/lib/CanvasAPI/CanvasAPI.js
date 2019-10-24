/**
 * Library for working with Canvas,
 * Works by using a 2D context as an argument
 * Provides abstraction for some common shapes in Canvas
 */


export class Shape {
  constructor(draw, metaData) {
    this.draw = draw;
    this.metaData = metaData;
  }
}

class CanvasAPI {
  constructor(ctx, strokeStyle = 'white') {
    this.layers = {
      initial: {
        ctx,
        shapes: new Map()
      }
    };

    this.defaultStrokeStyle = strokeStyle;
    ctx.strokeStyle = strokeStyle;
  }

  addLayer(name) {
    if (!this.layers.initial.ctx) {
      throw 'Cannot create layer, no initial context found';
    } else {
      let originCanvas = this.layers.initial.ctx.canvas;

      let parentNode = originCanvas.parentNode;
      let newCanvas = originCanvas.cloneNode();

      newCanvas.id = name;
      parentNode.insertBefore(newCanvas, originCanvas);

      this.layers[name] = {
        ctx: newCanvas.getContext('2d'),
        shapes: new Map()
      };
    }
  }

  removeLayer(name) {
    let originCanvas = this.layers.initial.ctx.canvas;
    let parentNode = originCanvas.parentNode;

    parentNode.querySelector(`#${name}`).remove();
    delete this.layers[name];
  }

  /**
   * Clears all the shapes
   */
  clear(layerName = 'initial') {
    let layer = this.layers[layerName];
    let ctx = layer.ctx;
    layer.shapes = new Map();
  }

  clearAllLayers() {
    for (let layerName in this.layers) {
      this.clear(layerName);
    }
  }

  /**
   * Removes a shape by its ID
   * @param id
   * @param layerName
   */
  remove(id, layerName = 'initial') {
    let layer = this.layers[layerName];
    let ctx = layer.ctx;
    let shapes = layer.shapes;
    shapes.delete(id);
  }

  /* istanbul ignore next */
  addImage({
    id,
    image, // the image to display
    x, y, // pos for x,y..
    height, width,
    cropStartX, cropStartY, cropSizeX, cropSizeY,
    rotation // in radians
  }, layerName = 'initial') {
    let layer = this.layers[layerName];
    let ctx = layer.ctx;
    let shapes = layer.shapes;

    shapes.set(id, new Shape(() => {
      ctx.beginPath();
      ctx.save();
      ctx.translate(x + width / 2, y + height / 2);
      ctx.rotate(rotation);
      ctx.drawImage(image,
        cropStartX, cropStartY, cropSizeX, cropSizeY,
        -width / 2, -height / 2,  // pos in canvas // at the top left of the canvas
        width, height); // size in canvas
      ctx.restore();
      ctx.closePath();
    }, {
      id,
      type: 'image',
      x,
      y,
      height,
      width
    }));
  }

  // TODO Finish this API
  addShape({id, drawFn, layerName = 'initial'}) {
    let layer = this.layers[layerName];
    let ctx = layer.ctx;
    let shapes = layer.shapes;

    shapes.set(id, new Shape(() => {
      drawFn(ctx);
    }));
  }

  addRect({id, x, y, width, height, strokeStyle, lineWidth}, layerName = 'initial') {
    let layer = this.layers[layerName];
    let ctx = layer.ctx;
    let shapes = layer.shapes;

    shapes.set(id, new Shape(() => {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.rect(
        x,
        y,
        width,
        height
      );
      ctx.stroke();
      ctx.closePath();
    }, {
      id,
      type: 'rect',
      x,
      y,
      height,
      width
    }));
  }

  addArc({id, direction, size, color = 'black', fillColor, lineWidth = 1, x, y, radius, layerName = 'initial'}) {
    let layer = this.layers[layerName];
    let ctx = layer.ctx;
    let shapes = layer.shapes;

    shapes.set(id, new Shape(() => {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;

      let startArc = direction - (size / 2);
      let endArc = direction + (size / 2);

      ctx.beginPath();
      ctx.arc(x, y, radius, startArc * Math.PI, endArc * Math.PI);
      if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
      ctx.stroke();
      ctx.closePath();
    }));
  }

  addCircle({id, x, y, radius, strokeStyle, lineWidth, fillColor}, layerName = 'initial') {
    let layer = this.layers[layerName];
    let ctx = layer.ctx;
    let shapes = layer.shapes;

    shapes.set(id, new Shape(() => {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.moveTo(x, y);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
      ctx.stroke();
      ctx.closePath();
    }, {
      id,
      type: 'circle',
      x,
      y,
      radius
    }));
  }

  /**
   * Method allows us to pan around the canvas
   */
  pan(x, y) {
    this.panX = x;
    this.panY = y;

    for (let layerName in this.layers) {
      let layer = this.layers[layerName];
      let ctx = layer.ctx;
      ctx.setTransform(1, 0, 0, 1, x, y);

      // non initial layers are drawn much less often, so we need a manual one here.
      if (layerName !== 'initial') {
        this.draw(layerName); // pan requires a draw to all non initial layers
      }
    }
  }

  getPan() {
    return {
      panX: this.panX || 0,
      panY: this.panY || 0
    };
  }

  write({id, text, x, y, font, textBaseline, fillStyle}, layerName = 'initial') {
    let layer = this.layers[layerName];
    let ctx = layer.ctx;
    let shapes = layer.shapes;

    shapes.set(id, new Shape(() => {
      ctx.beginPath();
      ctx.font = font;
      ctx.textBaseline = textBaseline;
      ctx.fillStyle = fillStyle;
      ctx.fillText(text, x, y);
      ctx.closePath();
    }, {
      id,
      x,
      y
    }));
  }

  draw(layerName = 'initial') {
    let layer = this.layers[layerName];
    let ctx = layer.ctx;
    let shapes = layer.shapes;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();

    for (let shape of shapes.values()) {
      shape.draw();
      ctx.strokeStyle = this.defaultStrokeStyle;
    }
  }
}

// adding an image causes segmentation fault for some reason :)
/* istanbul ignore next */
if (process.env.NODE_ENV === 'test') {
  CanvasAPI.prototype.addImage = () => {
  };
}
export default CanvasAPI;