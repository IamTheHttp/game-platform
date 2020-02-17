import React from 'react';
import CanvasAPI from 'lib/CanvasAPI/CanvasAPI';
import SelectedBox from './SelectedBox/SelectedBox';
import getShapesFromClick from './selectionUtils/getShapesFromClick';
import getShapesInSelectionBox from './selectionUtils/getShapesInSelectionBox';
import {IViewClickInfo, IViewMoveInfo, IGameCanvasOptions, IClientViewCoordinates} from "../interfaces";

class GameCanvas {
  selectedBoxColor: string;
  mapHeight: number;
  mapWidth: number;
  viewHeight: number;
  viewWidth: number;
  onViewMapClick: (arg: IViewClickInfo) => void;
  onViewMapMove: (arg: IViewMoveInfo) => void;
  onMiniMapClick: (e: MouseEvent) => void;
  onMiniMapMove: (e: MouseEvent) => void;
  enableSelectBox: boolean;
  lastClick: number;
  dbClick: boolean;
  dbTap: boolean;
  lastTap: number;
  selectedBox: SelectedBox;
  isMouseDown: boolean;
  mapAPI: CanvasAPI;
  miniMapAPI: CanvasAPI;
  lastKnownPositionInCanvasTermsX: number;
  lastKnownPositionInCanvasTermsY: number;
  viewMapCanvas: HTMLCanvasElement;
  miniMapCanvas: HTMLCanvasElement;
  miniMapX: number;
  miniMapY: number;


  constructor(options: IGameCanvasOptions) {
    let noop = () => {
    };
    this.selectedBoxColor = options.selectedBoxColor || 'blue';
    this.mapHeight = options.mapHeight;
    this.mapWidth = options.mapWidth;
    this.viewHeight = options.viewHeight;
    this.viewWidth = options.viewWidth;
    this.onViewMapClick = options.onViewMapClick || noop;
    this.onViewMapMove = options.onViewMapMove || noop;
    this.onMiniMapClick = options.onMiniMapClick || noop;
    this.onMiniMapMove = options.onMiniMapMove || noop;
    this.enableSelectBox = options.enableSelectBox;
    this.lastClick = 0;
    this.isMouseDown = false;
    this.dbClick = false;
    this.lastTap = 0;
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

  /**
   * @desc - Gets the x,y position inside the canvas based on a mouse event with clientX and clientY
   *         Will return X,Y values in relative terms to the painted Canvas dimensions and includes panning
   * @param clientInputCoordinates
   * @param canvas
   * @param canvasAPI
   */
  getCursorPositionInCanvasTerms(clientInputCoordinates: IClientViewCoordinates, canvas: HTMLCanvasElement, canvasAPI: CanvasAPI): {x: number, y: number} {
    let rect = canvas.getBoundingClientRect();

    if (typeof clientInputCoordinates.x !== 'number' || typeof clientInputCoordinates.y !== 'number') {
      throw 'Invalid inputCoordinates provided, missing X or Y';
    }

    // X/Y represent the point inside the client view that was touched.
    // this ignores scrolling, so the top left corner will always be 0,0 no matter the scroll
    // this X,Y is not yet scaled for canvas
    let rawXOnCanvasElement = clientInputCoordinates.x - rect.left;
    let rawYyOnCanvasElement = clientInputCoordinates.y - rect.top;

    // we need to scale the touch point with the real dimensions.
    // the HTML element can be 100px wide, but the Canvas within can be 1000px wide.
    // this ratio will allow us to correctly set the X,Y touch point
    let WIDTH_RATIO = canvas.width / rect.width;
    let HEIGHT_RATIO = canvas.height / rect.height;


    let scaledX = Math.max(0, Math.round(rawXOnCanvasElement * WIDTH_RATIO));
    let scaledY = Math.max(0, Math.round(rawYyOnCanvasElement * HEIGHT_RATIO));

    // Now we're in scaled canvas X,Y terms, we can safely subtract the Pan to get the right position
    let x = scaledX - canvasAPI.getPan().panX;
    let y = scaledY - canvasAPI.getPan().panY;

    return {x, y};
  }

  private handleMapMouseMove() {
    if (this.isMouseDown) {
      if (this.enableSelectBox === false) {
        return;
      } else {
        this.selectedBox.setEnd(this.lastKnownPositionInCanvasTermsX, this.lastKnownPositionInCanvasTermsY);
        let data = this.selectedBox.getData();

        this.mapAPI.addRect({
          id: 'selectedBox',
          x: data.start.x,
          y: data.start.y,
          width: data.width,
          height: data.height,
          strokeStyle: this.selectedBoxColor,
          lineWidth: 1,
          layerName: 'initial',
          fillColor: null
        });
      }
    }

    this.onViewMapMove({
      x: this.lastKnownPositionInCanvasTermsX,
      y: this.lastKnownPositionInCanvasTermsY,
      isMouseDown: this.isMouseDown,
      dbClick: this.dbClick,
      selectedBox: this.selectedBox.getData()
    });
  }

  private handleMapMouseLeave() {
    if (this.isMouseDown) {
      this.handleMapMouseUp();
    }
  }

  private handleMapTouchEnd() {
    this.isMouseDown = false;

    let selectedData = this.selectedBox.getData();

    let layers = Object.keys(this.mapAPI.layers);

    let hits = [];
    // if a single click...

    layers.forEach((layerName) => {
      if (selectedData.end.x === selectedData.start.x) {
        let x = this.lastKnownPositionInCanvasTermsX;
        let y = this.lastKnownPositionInCanvasTermsY;
        hits = [...hits, ...getShapesFromClick(this.mapAPI.layers[layerName].shapes, layerName, x, y)];
      } else {
        hits = [...hits, ...getShapesInSelectionBox(this.mapAPI.layers[layerName].shapes, layerName, selectedData)];
      }
    });

    this.mapAPI.addRect({
      fillColor: null,
      layerName: "initial",
      lineWidth: 1,
      strokeStyle: null,
      id: 'selectedBox',
      x: 0,
      y: 0,
      width: 0,
      height: 0
    });

    this.onViewMapClick({
      x: this.lastKnownPositionInCanvasTermsX,
      y: this.lastKnownPositionInCanvasTermsY,
      isMouseDown: this.isMouseDown,
      dbClick: this.dbTap || this.dbClick,
      selectedBox: selectedData,
      hits
    });
    this.selectedBox.reset();
  }

  private handleMapMouseUp() {
    if (!this.lastTap) {
      this.handleMapTouchEnd();
    }
  }

  updateViewMapCursorPosition(inputCoordinates: IClientViewCoordinates): IClientViewCoordinates  {
    let {x, y} = this.getCursorPositionInCanvasTerms(inputCoordinates, this.viewMapCanvas, this.mapAPI);
    this.lastKnownPositionInCanvasTermsX = x;
    this.lastKnownPositionInCanvasTermsY = y;

    return {x, y}
  }

  updateMiniMapCursorPosition(inputCoordinates: IClientViewCoordinates) {
    let {x, y} = this.getCursorPositionInCanvasTerms(inputCoordinates, this.miniMapCanvas, this.miniMapAPI);
    this.miniMapX = x;
    this.miniMapY = y;
  }

  getNewCanvasPairs({getMapRef, getMiniRef}: {getMapRef: (a: CanvasAPI) => void, getMiniRef: (a: CanvasAPI) => void}) {
    return {
      map: this.generateMapCanvas(getMapRef),
      minimap: this.generateMiniMapCanvas(getMiniRef)
    };
  }

  private handleMiniMapMove(event: MouseEvent) {
    this.onMiniMapMove(event);
  }

  private handleMiniMapClick(event) {
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
      fillColor: null,
      layerName: "initial",
      id: 'currentMap',
      x: -this.mapAPI.getPan().panX,
      y: -this.mapAPI.getPan().panY,
      width: this.viewWidth,
      height: this.viewHeight,
      strokeStyle: 'green',
      lineWidth: 20
    });
  }

  private handleMapMouseDown() {
    if (!this.lastTap) {
      let now = new Date().getTime();
      this.dbClick = (now - this.lastClick) < 300;
      this.lastClick = now;
      this.isMouseDown = true;
      this.setSelectBox();
    }
  }

  setSelectBox() {
    if (this.enableSelectBox === false) {
      return;
    }

    this.selectedBox.setStart(this.lastKnownPositionInCanvasTermsX, this.lastKnownPositionInCanvasTermsY);
    this.selectedBox.setEnd(this.lastKnownPositionInCanvasTermsX, this.lastKnownPositionInCanvasTermsY);
  }

  private handleTouchStart(e: TouchEvent) {
    let coords = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    this.updateViewMapCursorPosition(coords);

    let {x, y} = this.getCursorPositionInCanvasTerms(coords, this.viewMapCanvas, this.mapAPI);
    let now = new Date().getTime();

    this.dbTap = (now - this.lastTap) < 300;
    this.lastTap = now;

    this.setSelectBox();
  }

  private handleMiniMapTouchStart(e: TouchEvent) {
    let coords = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    let {x, y} = this.getCursorPositionInCanvasTerms(coords, this.miniMapCanvas, this.miniMapAPI);

    this.miniMapX = x;
    this.miniMapY = y;

    this.handleMiniMapClick(e);
  }


  private ensureNegative(a: number) {
    return Math.min(a, 0);
  }

  // Clicking / Touching the minimap should pan the main view
  private handleTouchMove(e) {
    e.preventDefault();
    // Canvas terms include

    let coords = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    let {x, y} = this.getCursorPositionInCanvasTerms(coords, this.viewMapCanvas, this.mapAPI);

    let {panX: currentPanX, panY: currentPanY} = this.mapAPI.getPan();

    // example: current is 5, lastKnown is 20, we moved -15.
    let xPxChange = x - this.lastKnownPositionInCanvasTermsX;
    let yPxChange = y - this.lastKnownPositionInCanvasTermsY;

    // the new pan is the current pan + the change in movement
    let plannedNewPanX = currentPanX + xPxChange;
    let plannedNewPanY = currentPanY + yPxChange;

    // We must ensure we don't escape from the bottom-right
    let IS_PANNING_CONTAINED_WITHIN_MAP_FOR_X = plannedNewPanX + this.viewWidth < this.mapWidth;
    let IS_PANNING_CONTAINED_WITHIN_MAP_FOR_Y = plannedNewPanY + this.viewWidth < this.mapHeight;

    // Max allowed panning will ensure we can't over-pan on the bottom right
    let MAX_ALLOWED_X_PANNING = this.viewWidth - this.mapWidth;
    let MAX_ALLOWED_Y_PANNING = this.viewHeight - this.mapHeight;

    let newPanX = IS_PANNING_CONTAINED_WITHIN_MAP_FOR_X ? plannedNewPanX : MAX_ALLOWED_X_PANNING;
    let newPanY = IS_PANNING_CONTAINED_WITHIN_MAP_FOR_Y ? plannedNewPanY : MAX_ALLOWED_Y_PANNING;

    // SAFETY
    // our panning is always negative, as don't allow to scroll off the edges
    // (if panning could be positive, we the canvas edge would be in the mainView)
    // This is equal to MIN_ALLOWED_X_PANNING = 0;
    this.mapAPI.pan(this.ensureNegative(newPanX), this.ensureNegative(newPanY));
  }

  generateMapCanvas(getRef: (a:CanvasAPI, b:HTMLCanvasElement) => void) {
    return (
      <canvas
        className='viewMap'
        ref={(el: HTMLCanvasElement) => {
          if (!el) {
            return null;
          }

          if (process.env.NODE_ENV === 'test' && !el.removeEventListener) {
            // @ts-ignore
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
      />
    );
  }

  generateMiniMapCanvas(getRef: (a:CanvasAPI, b:HTMLCanvasElement) => void) {
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
      />
    );
  }
}

export default GameCanvas;