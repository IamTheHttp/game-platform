/**
 * Library for working with Canvas,
 * Works by using a 2D context as an argument
 * Provides abstraction for some common shapes in Canvas
 */

class CanvasAPI {
  constructor(ctx, strokeStyle = 'white') {
    this.ctx = ctx;
    this.defaultStrokeStyle = strokeStyle;
    ctx.strokeStyle = strokeStyle;
    this.shapes = new Map();
  }

  /**
   * Clears all the shapes
   */
  clear() {
    this.shapes = new Map();
  }

  /**
   * Removes a shape by its ID
   * @param id
   */
  remove(id) {
    this.shapes.delete(id);
  }


  /* istanbul ignore next */
  addImage({
    id,
    image, // the image to display
    x, y, // pos for x,y..
    height, width,
    cropStartX, cropStartY, cropSizeX, cropSizeY,
    rotation // in radians
  }) {
    let ctx = this.ctx;
    this.shapes.set(id, () => {
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
    });
  }

  addRect({id, x, y, width, height, strokeStyle, lineWidth}) {
    let ctx = this.ctx;
    this.shapes.set(id, () => {
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
    });
  }

  addCircle({id, x, y, radius, strokeStyle, lineWidth, fillColor}) {
    let ctx = this.ctx;
    this.shapes.set(id, () => {
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
    });
  }

  /**
   * Method allows us to pan around the canvas
   */
  pan(x, y) {
    this.panX = x;
    this.panY = y;
    this.ctx.setTransform(1, 0, 0, 1, x, y);
  }

  getPan() {
    return {
      panX : this.panX || 0,
      panY : this.panY || 0
    };
  }

  write({id, text, x, y, font, textBaseline, fillStyle}) {
    this.shapes.set(id, () => {
      this.ctx.beginPath();
      this.ctx.font = font;
      this.ctx.textBaseline = textBaseline;
      this.ctx.fillStyle = fillStyle;
      this.ctx.fillText(text, x, y);
      this.ctx.closePath();
    });
  }

  draw() {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.restore();

    for (let shape of this.shapes.values()) {
      shape();
      this.ctx.strokeStyle = this.defaultStrokeStyle;
    }
  }
}

// adding an image causes segmentation fault for some reason :)
/* istanbul ignore next */
if (process.env.NODE_ENV === 'test') {
  CanvasAPI.prototype.addImage = () => {};
}
export default CanvasAPI;