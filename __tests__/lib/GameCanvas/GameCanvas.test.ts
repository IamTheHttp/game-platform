/* global describe */
/* global it */
/* global expect */
/* global beforeEach */
import GameCanvas from 'lib/GameCanvas/GameCanvas';
import {mount} from 'enzyme';
import CanvasAPI from "../../../src/lib/CanvasAPI/CanvasAPI";

interface APIs {
  mapAPI: CanvasAPI,
  minimapAPI: CanvasAPI
}


class MockedCanvas extends HTMLCanvasElement {
  height: number;
  width: number;
}


class MockedGameCanvas extends GameCanvas {
  onViewMapClick:jest.Mocked<any>;
  onMiniMapClick:jest.Mocked<any>;
  onViewMapMove:jest.Mocked<any>;
  viewMapCanvas: MockedCanvas;
  lastKnownPositionInCanvasTermsY: number;
  lastKnownPositionInCanvasTermsX: number;
}

describe('Tests Game canvas', () => {
  let gameCanvas: MockedGameCanvas;
  let apis: APIs = {
    minimapAPI:null,
    mapAPI:null
  };

  beforeEach(() => {
    let onViewMapClick = jest.fn();
    let onViewMapMove = jest.fn();
    let onMiniMapClick = jest.fn();



    gameCanvas = new GameCanvas({
      mapHeight: 100,
      mapWidth: 100,
      viewHeight: 50,
      viewWidth: 50,
      onViewMapClick,
      onViewMapMove,
      onMiniMapClick
    });

    let {map, minimap} = gameCanvas.getNewCanvasPairs({
      getMapRef: (API) => {
        apis.mapAPI = API;
      },
      getMiniRef: (API) => {
        apis.minimapAPI = API;
      }
    });

    HTMLCanvasElement.prototype.getBoundingClientRect = () => {
      return {
        top: 0,
        left: 0,
        right: 100,
        bottom: 100,
        width: 100,
        height: 100,
        x:0,
        y: 0,
        toJSON: () => {}
      }
    };
    mount(map);
    mount(minimap);
  });

  it('Tests optional arguments for click and move (No errors)', () => {
    gameCanvas = new GameCanvas({
      mapHeight: 100,
      mapWidth: 100,
      viewHeight: 50,
      viewWidth: 50
    });

    let {map, minimap} = gameCanvas.getNewCanvasPairs({
      getMapRef: (API) => {
        apis.mapAPI = API;
      },
      getMiniRef: (API) => {
        apis.minimapAPI = API;
      }
    });

    mount(map);
    mount(minimap);
  });


  it('tests handleMapMouseMove', () => {
    gameCanvas.isMouseDown = true;
    gameCanvas.lastKnownPositionInCanvasTermsX = 10;
    gameCanvas.lastKnownPositionInCanvasTermsY = 15;
    gameCanvas.handleMapMouseMove();
    let fnArg = gameCanvas.onViewMapMove.mock.calls[0][0];
    expect(fnArg.x).toBe(10);
    expect(fnArg.y).toBe(15);
    expect(fnArg.isMouseDown).toBe(true);

    gameCanvas.isMouseDown = false;
    gameCanvas.handleMapMouseMove();
    fnArg = gameCanvas.onViewMapMove.mock.calls[1][0];
    expect(fnArg.isMouseDown).toBe(false);
  });

  it('tests handleMapMouseUp', () => {
    gameCanvas.lastKnownPositionInCanvasTermsX = 10;
    gameCanvas.lastKnownPositionInCanvasTermsY = 15;
    gameCanvas.lastTap = 1;
    gameCanvas.handleMapMouseUp();
    expect(gameCanvas.onViewMapClick.mock.calls.length).toBe(0);

    gameCanvas.lastTap = 0;
    gameCanvas.handleMapMouseUp();
    let fnArg = gameCanvas.onViewMapClick.mock.calls[0][0];
    expect(fnArg.x).toBe(10);
    expect(fnArg.y).toBe(15);
  });

  it('tests handleMapMouseLeave, should trigger onViewMapClick', () => {
    gameCanvas.handleMapMouseLeave();
    expect(gameCanvas.onViewMapClick.mock.calls.length).toBe(0);
    gameCanvas.isMouseDown = true;
    gameCanvas.handleMapMouseLeave();
    expect(gameCanvas.onViewMapClick.mock.calls.length).toBe(1);
  });

  it('tests handleMapTouchEnd, should trigger onViewMapClick', () => {
    gameCanvas.handleMapTouchEnd();
    expect(gameCanvas.onViewMapClick.mock.calls.length).toBe(1);
  });

  it('tests updateViewMapCursorPosition, should populate lastKnownPositionInCanvasTermsX and lastKnownPositionInCanvasTermsY', () => {
    let canvas = {
      width: 100,
      height: 100,
      getBoundingClientRect() {
        return {
          left: 0,
          top: 0,
          width: 100,
          height: 100
        };
      }
    };
    let canvasAPI = {
      getPan() {
        return {
          panX: 0,
          panY: 0
        };
      }
    };

    // TODO is there a clever solution?
    // @ts-ignore
    gameCanvas.viewMapCanvas = canvas;
    // @ts-ignore
    gameCanvas.mapAPI = canvasAPI;
    gameCanvas.updateViewMapCursorPosition({
      x:10, y:10
    });
    expect(gameCanvas.lastKnownPositionInCanvasTermsX).toBe(10);
    expect(gameCanvas.lastKnownPositionInCanvasTermsY).toBe(10);
  });

  it('tests updateMiniMapCursorPosition, should populate miniMapX and miniMapY', () => {
    gameCanvas.updateMiniMapCursorPosition({x: 10, y:10});
    expect(gameCanvas.miniMapX).toBe(10);
    expect(gameCanvas.miniMapY).toBe(10);
  });

  it('tests handleMapMouseDown, should set variables on instance', () => {
    gameCanvas.handleMapMouseDown();
  });

  it('tests handleMiniMapClick, Should trigger pan on the canvasAPI', () => {
    // The point of this test is to "centralize" the current X,Y
    gameCanvas.miniMapX = 50;
    gameCanvas.miniMapY = 50;
    let mocked = jest.spyOn(apis.mapAPI, 'pan');
    gameCanvas.handleMiniMapClick({});

    expect(mocked.mock.calls.length).toBe(1);
    expect(mocked.mock.calls[0]).toEqual([-25, -25]);
  });

  it('tests handleTouchMove, Should trigger pan on the canvasAPI', () => {
    let MAP_WIDTH = 1000;
    let MAP_HEIGHT = 1000;

    gameCanvas.lastKnownPositionInCanvasTermsX = 50;
    gameCanvas.lastKnownPositionInCanvasTermsY = 50;
    gameCanvas.mapWidth = MAP_WIDTH;
    gameCanvas.mapHeight = MAP_HEIGHT;

    let event = {
      preventDefault: () => {},
      touches: [
        {
          clientX: 0,
          clientY: 0
        }
      ]
    };

    let canvas = {
      width: MAP_WIDTH / 10, // this is how big the canvas element is, not logically what's inside it
      height: MAP_HEIGHT / 10, // this is how big the canvas element is, not logically what's inside it
      getBoundingClientRect() {
        return {
          left: 0,
          top: 0,
          width: MAP_WIDTH,
          height: MAP_HEIGHT
        };
      }
    };

    let canvasAPI = {
      getPan() {
        return {
          panX: 0,
          panY: 0
        };
      },
      pan(x, y) {}
    };

    gameCanvas.viewMapCanvas = canvas as HTMLCanvasElement; // for tests we just want a small subset, so any is ok
    gameCanvas.mapAPI = canvasAPI as CanvasAPI;
    let mocked = jest.spyOn(gameCanvas.mapAPI, 'pan');

    gameCanvas.handleTouchMove(event);

    // first call, first argument(array) 1st and 2nd arg
    expect(mocked.mock.calls[0][0]).toBe(-50);
    expect(mocked.mock.calls[0][1]).toBe(-50);
    expect(gameCanvas.lastKnownPositionInCanvasTermsX).toBe(50);
    expect(gameCanvas.lastKnownPositionInCanvasTermsY).toBe(50);
  });

  it('tests handleTouchStart, ShouldW set lastKnownPositionInCanvasTermsX and lastKnownPositionInCanvasTermsY', () => {
    let event = {
      touches: [
        {
          clientX: 10,
          clientY: 10
        }
      ]
    };

    let canvas = {
      width: 100,
      height: 100,
      getBoundingClientRect() {
        return {
          left: 0,
          top: 0,
          width: 100,
          height: 100
        };
      }
    };

    let canvasAPI = {
      getPan() {
        return {
          panX: 0,
          panY: 0
        };
      }
    };

    gameCanvas.viewMapCanvas = canvas as HTMLCanvasElement; // for tests we just want a small subset, so any is ok
    gameCanvas.mapAPI = canvasAPI as CanvasAPI; // for tests we just want a small subset, so any is ok
    gameCanvas.handleTouchStart(event as unknown as TouchEvent);
    expect(gameCanvas.lastKnownPositionInCanvasTermsX).toBe(10);
    expect(gameCanvas.lastKnownPositionInCanvasTermsY).toBe(10);
  });
});