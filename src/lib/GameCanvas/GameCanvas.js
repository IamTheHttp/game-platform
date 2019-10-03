import React from 'react';
import CanvasAPI from 'lib/CanvasAPI/CanvasAPI';
import SelectedBox from './SelectedBox/SelectedBox';
import getShapesFromClick from './selectionUtils/getShapesFromClick';
import getShapesInSelectionBox from './selectionUtils/getShapesInSelectionBox';

class GameCanvas {
  constructor(options) {
    this.selectedBoxColor = options.selectedBoxColor || 'blue';
    this.mapHeight = options.mapHeight;
    this.mapWidth = options.mapWidth;
    this.viewHeight = options.viewHeight;
    this.viewWidth = options.viewWidth;
    this.onViewMapClick = options.onViewMapClick;
    this.onViewMapMove = options.onViewMapMove;
  
    this.onMiniMapClick = options.onMiniMapClick;
    this.onMiniMapMove = options.onMiniMapMove;
    
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
    this.handleMiniMapMove = this.handleMiniMapMove.bind(this);
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

      let data = this.selectedBox.getData();

      this.mapAPI.addRect({
        id: 'selectedBox',
        x: data.start.x,
        y: data.start.y,
        width: data.width,
        height: data.height,
        strokeStyle: this.selectedBoxColor
      });
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

    let selectedData = this.selectedBox.getData();

    let hits = [];
    // if a single click...
    if (selectedData.end.x === selectedData.start.x) {
      let x = selectedData.end.x;
      let y = selectedData.end.y;
      hits = getShapesFromClick(this.mapAPI.layers.initial.shapes, x, y);
    } else {
      hits = getShapesInSelectionBox(this.mapAPI.layers.initial.shapes, selectedData);
    }

    this.mapAPI.addRect({
      id: 'selectedBox',
      x: 0,
      y: 0,
      width: 0,
      height: 0
    });

    this.onViewMapClick({
      x: this.viewMapX,
      y: this.viewMapY,
      isMouseDown: this.isMouseDown,
      dbClick: this.dbTap || this.dbClick,
      selectedBox: selectedData,
      hits
    });
    this.selectedBox.reset();
  }

  handleMapMouseUp() {
    if (!this.lastTap) {
      this.handleMapTouchEnd();
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
      map: this.generateMapCanvas(getMapRef),
      minimap: this.generateMiniMapCanvas(getMiniRef)
    };
  }

  handleMiniMapMove(event) {
    this.onMiniMapMove(event);
  }
  
  handleMiniMapClick(event) {
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

    // draw the minimap square box
    this.updateMiniMapSquare();
    this.onMiniMapClick(event);
  }

  updateMiniMapSquare() {
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
        className='viewMap'
        ref={(el) => {
          if (!el) {
            return null;
          }
          
          if (process.env.NODE_ENV === 'test' && !el.removeEventListener) {
            el = el._reactInternalFiber.child.stateNode; // eslint-disable-line
          }

          this.viewMapCanvas = el;
          document.removeEventListener('mousemove', this.updateViewMapCursorPosition);
          document.addEventListener('mousemove', this.updateViewMapCursorPosition);
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
        className='minimap'
        ref={(el) => {
          if (!el) {
            return null;
          }
  
          if (process.env.NODE_ENV === 'test' && !el.removeEventListener) {
            el = el._reactInternalFiber.child.stateNode; // eslint-disable-line
          }
          
          this.miniMapCanvas = el;
          document.removeEventListener('mousemove', this.updateMiniMapCursorPosition);
          document.addEventListener('mousemove', this.updateMiniMapCursorPosition);

          this.miniMapAPI = new CanvasAPI(el.getContext('2d'));

          // TODO - what? why? is this needed?
          let key = setInterval(() => {
            if (this.mapAPI) {
              this.updateMiniMapSquare();
              clearInterval(key);
            }
          }, 100);

          getRef(this.miniMapAPI, el);
        }}
        height={this.mapHeight}
        width={this.mapWidth}
        onMouseMove={this.handleMiniMapMove}
        onMouseDown={this.handleMiniMapClick}
        onTouchStart={this.handleMiniMapTouchStart}
      ></canvas>
    );
  }
}

export default GameCanvas;