import React from 'react';
import CanvasAPI from 'lib/CanvasAPI/CanvasAPI';
import SelectedBox from './SelectedBox/SelectedBox';

class GameCanvas {
  constructor(options) {
    this.mapHeight = options.mapHeight;
    this.mapWidth = options.mapWidth;
    this.viewHeight = options.viewHeight;
    this.viewWidth = options.viewWidth;
    this.onViewMapClick = options.onViewMapClick;
    this.onViewMapMove = options.onViewMapMove;
    // this.onMiniMapClick = options.onMiniMapClick;
    this.lastClick = 0;
    this.dbClick = false;
    this.lastTap = 0;
    this.lastClick = false;
    this.selectedBox = new SelectedBox();
    this.updateViewMapCursorPosition = this.updateViewMapCursorPosition.bind(this);
    this.updateMiniMapCursorPosition = this.updateMiniMapCursorPosition.bind(this);
    this.handleMapMouseUp = this.handleMapMouseUp.bind(this);
    this.handleMapMouseDown = this.handleMapMouseDown.bind(this);
    this.handleMiniMapClick = this.handleMiniMapClick.bind(this);
    this.handleMapMouseMove = this.handleMapMouseMove.bind(this);
    this.handleMapMouseLeave = this.handleMapMouseLeave.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleMapTouchEnd = this.handleMapTouchEnd.bind(this);
    this.handleMiniMapTouchStart = this.handleMiniMapTouchStart.bind(this);
  }

  updateCursorPosition(event, canvas, canvasAPI) {
    let rect = canvas.getBoundingClientRect();
    // base position
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    x = Math.max(0, Math.round(x * (canvas.width / rect.width))) - canvasAPI.getPan().panX;
    y = Math.max(0, Math.round(y * (canvas.height / rect.height))) - canvasAPI.getPan().panY;

    return {x, y};
  }

  handleMapMouseMove() {
    if (this.isMouseDown) {
      this.selectedBox.setEnd(this.viewMapX, this.viewMapY);
    }
    this.onViewMapMove({
      x: this.viewMapX,
      y: this.viewMapY,
      isMouseDown: this.isMouseDown,
      dbClick: this.dbClick,
      selectedBox: this.selectedBox.getData()
    });
  }

  handleMapMouseLeave() {
    if (this.isMouseDown) {
      this.handleMapMouseUp();
    }
  }

  handleMapTouchEnd() {
    this.isMouseDown = false;

    this.mapAPI.shapes.forEach((data, shapeID) => {
      console.log(shapeID, data);
    });

    this.onViewMapClick({
      x: this.viewMapX,
      y: this.viewMapY,
      isMouseDown: this.isMouseDown,
      dbClick: this.dbTap,
      selectedBox: this.selectedBox.getData()
    });
    this.selectedBox.reset();
  }

  handleMapMouseUp() {
    if (!this.lastTap) {
      this.isMouseDown = false;

      this.mapAPI.shapes.forEach((data, shapeID) => {
        console.log(shapeID, data);
      });

      this.onViewMapClick({
        x: this.viewMapX,
        y: this.viewMapY,
        isMouseDown: this.isMouseDown,
        dbClick: this.dbClick,
        selectedBox: this.selectedBox.getData()
      });
      this.selectedBox.reset();
    }
  }


  updateViewMapCursorPosition(event) {
    let {x, y} = this.updateCursorPosition(event, this.viewMapCanvas, this.mapAPI);
    this.viewMapX = x;
    this.viewMapY = y;
  }

  updateMiniMapCursorPosition(event) {
    let {x, y} = this.updateCursorPosition(event, this.miniMapCanvas, this.miniMapAPI);
    this.miniMapX = x;
    this.miniMapY = y;
  }

  getNewCanvasPairs({getMapRef, getMiniRef}) {
    return {
      map: this.GenerateMapCanvas(getMapRef),
      minimap: this.generateMiniMapCanvas(getMiniRef)
    };
  }

  handleMiniMapClick() {
    let x = this.miniMapX;
    let y = this.miniMapY;
    // Handle negative overflows, both numbers should be positive
    // the reason we divide in 2 is because we want to center the view
    let calcPanX = Math.max(x - this.viewWidth / 2, 0);
    let calcPanY = Math.max(y - this.viewHeight / 2, 0);

    // Handle positive overflows, both numbers should not exceed map size
    let width = this.mapWidth;
    let height = this.mapHeight;

    calcPanX = calcPanX + this.viewWidth < width ? calcPanX : width - this.viewWidth;
    calcPanY = calcPanY + this.viewHeight < height ? calcPanY : height - this.viewHeight;

    this.mapAPI.pan(-calcPanX, -calcPanY);

    console.log('Not too bad?');
    // draw the minimap square box
    // TODO - This has to be configurable
    // TODO conditional render it, and allow for some configuration options
    this.miniMapAPI.addRect({
      id: 'currentMap',
      x: -this.mapAPI.getPan().panX,
      y: -this.mapAPI.getPan().panY,
      width: this.viewWidth,
      height: this.viewHeight,
      strokeStyle: 'green',
      lineWidth: 20
    });
  }

  handleMapMouseDown() {
    if (!this.lastTap) {
      let now = new Date().getTime();
      this.dbClick = (now - this.lastClick) < 300;
      this.lastClick = now;
      this.isMouseDown = true;
      this.setSelectBox();
    }
  }

  setSelectBox() {
    this.selectedBox.setStart(this.viewMapX, this.viewMapY);
    this.selectedBox.setEnd(this.viewMapX, this.viewMapY);
  }

  handleTouchStart(e) {
    let {x, y} = this.updateCursorPosition(e.touches[0], this.viewMapCanvas, this.mapAPI);
    let now = new Date().getTime();

    this.dbTap = (now - this.lastTap) < 300;
    this.lastTap = now;

    this.viewMapX = x;
    this.viewMapY = y;

    this.setSelectBox();
  }

  handleMiniMapTouchStart(e) {
    let {x, y} = this.updateCursorPosition(e.touches[0], this.miniMapCanvas, this.miniMapAPI);

    this.miniMapX = x;
    this.miniMapY = y;

    this.handleMiniMapClick();
  }


  handleTouchMove(e) {
    e.preventDefault();
    // REFACTOR this code seems very similar to the onMinimapClick!
    let {x, y} = this.updateCursorPosition(e.touches[0], this.viewMapCanvas, this.mapAPI);

    let calcPanX;
    let calcPanY;
    let {panX, panY} = this.mapAPI.getPan();

    let xMoved = x - this.viewMapX;
    let yMoved = y - this.viewMapY;

    calcPanX = panX + xMoved;
    calcPanY = panY + yMoved;

    // both numbers should be negative
    calcPanX = Math.min(calcPanX, 0);
    calcPanY = Math.min(calcPanY, 0);

    // the panning + the mapSize, should not exceed the viewSize
    let width = this.mapWidth;
    let height = this.mapHeight;
    calcPanX = -calcPanX + this.viewWidth < width ? calcPanX : this.viewWidth - width;
    calcPanY = -calcPanY + this.viewHeight < height ? calcPanY : this.viewHeight - height;

    this.mapAPI.pan(calcPanX, calcPanY);
  }

  generateMapCanvas(getRef) {
    return (
      <canvas
        className="viewMap"
        ref={(el) => {
          if (!el) {
            return null;
          }
          this.viewMapCanvas = el;
          document.removeEventListener('mousemove', this.updateViewMapCursorPosition);
          document.addEventListener('mousemove', this.updateViewMapCursorPosition);
          // REFACTOR move to regular events?
          el.removeEventListener('touchmove', this.handleTouchMove, false);
          el.addEventListener('touchmove', this.handleTouchMove, false);

          this.mapAPI = new CanvasAPI(el.getContext('2d'));
          getRef(this.mapAPI, el);
        }}
        height={this.viewHeight}
        width={this.viewWidth}
        onMouseDown={this.handleMapMouseDown}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleMapTouchEnd}
        onMouseMove={this.handleMapMouseMove}
        onMouseUp={this.handleMapMouseUp}
        onMouseLeave={this.handleMapMouseLeave}
      ></canvas>
    );
  }

  generateMiniMapCanvas(getRef) {
    return (
      <canvas
        className="minimap"
        ref={(el) => {
          if (!el) {
            return null;
          }
          this.miniMapCanvas = el;
          document.removeEventListener('mousemove', this.updateMiniMapCursorPosition);
          document.addEventListener('mousemove', this.updateMiniMapCursorPosition);

          this.miniMapAPI = new CanvasAPI(el.getContext('2d'));
          getRef(this.miniMapAPI, el);
        }}
        height={this.mapHeight}
        width={this.mapWidth}
        onMouseDown={this.handleMiniMapClick}
        onTouchStart={this.handleMiniMapTouchStart}
      ></canvas>
    );
  }
}

export default GameCanvas;