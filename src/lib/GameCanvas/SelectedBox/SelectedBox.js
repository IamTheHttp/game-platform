/**
 * TODO what does this do exactly?
 */
class SelectedBox {
  constructor() {
    this.reset();
  }

  reset() {
    this.start = {
      x: 0,
      y: 0
    };
    this.end = {
      x: 0,
      y: 0
    };
  }

  getData() {
    return {
      start : Object.assign({}, this.start),
      end : Object.assign({}, this.end),
      width : this.getWidth(),
      height : this.getHeight()
    };
  }

  getHeight() {
    return this.end.y - this.start.y;
  }

  getWidth() {
    return this.end.x - this.start.x;
  }

  setStart(x, y) {
    this.start.x = x;
    this.start.y = y;
  }

  setEnd(x, y) {
    this.end.x = x;
    this.end.y = y;
  }
}

export default SelectedBox;