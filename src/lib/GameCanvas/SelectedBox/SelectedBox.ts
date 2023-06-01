import {ISelectedBoxData, ICoordinates} from '../../interfaces';

/**
 * Class that represents the current selected area by the user
 * Populated when the user click, holds and move the mouse
 */
class SelectedBox {
  start: ICoordinates;
  end: ICoordinates;

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

  getData(): ISelectedBoxData {
    return {
      start: Object.assign({}, this.start),
      end: Object.assign({}, this.end),
      width: this.getWidth(),
      height: this.getHeight()
    };
  }

  getHeight() {
    return this.end.y - this.start.y;
  }

  getWidth() {
    return this.end.x - this.start.x;
  }

  setStart(x: number, y: number) {
    this.start.x = x;
    this.start.y = y;
  }

  setEnd(x: number, y: number) {
    this.end.x = x;
    this.end.y = y;
  }
}

export default SelectedBox;
