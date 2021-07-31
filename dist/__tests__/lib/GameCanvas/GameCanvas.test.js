var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { GameCanvas } from "../../../src";
import { mount } from "enzyme";
var MockedCanvas = /** @class */ (function (_super) {
    __extends(MockedCanvas, _super);
    function MockedCanvas() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MockedCanvas;
}(HTMLCanvasElement));
var MockedGameCanvas = /** @class */ (function (_super) {
    __extends(MockedGameCanvas, _super);
    function MockedGameCanvas() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MockedGameCanvas;
}(GameCanvas));
describe('Tests Game canvas', function () {
    var gameCanvas;
    var apis = {
        minimapAPI: null,
        mapAPI: null
    };
    beforeEach(function () {
        var onViewMapClick = jest.fn();
        var onViewMapMove = jest.fn();
        var onMiniMapClick = jest.fn();
        gameCanvas = new GameCanvas({
            mapHeight: 100,
            mapWidth: 100,
            viewHeight: 50,
            viewWidth: 50,
            onViewMapClick: onViewMapClick,
            onViewMapMove: onViewMapMove,
            onMiniMapClick: onMiniMapClick
        });
        var _a = gameCanvas.getNewCanvasPairs({
            getMapRef: function (API) {
                apis.mapAPI = API;
            },
            getMiniRef: function (API) {
                apis.minimapAPI = API;
            }
        }), map = _a.map, minimap = _a.minimap;
        HTMLCanvasElement.prototype.getBoundingClientRect = function () {
            return {
                top: 0,
                left: 0,
                right: 100,
                bottom: 100,
                width: 100,
                height: 100,
                x: 0,
                y: 0,
                toJSON: function () { }
            };
        };
        mount(map);
        mount(minimap);
    });
    it('Tests optional arguments for click and move (No errors)', function () {
        gameCanvas = new GameCanvas({
            mapHeight: 100,
            mapWidth: 100,
            viewHeight: 50,
            viewWidth: 50
        });
        var _a = gameCanvas.getNewCanvasPairs({
            getMapRef: function (API) {
                apis.mapAPI = API;
            },
            getMiniRef: function (API) {
                apis.minimapAPI = API;
            }
        }), map = _a.map, minimap = _a.minimap;
        mount(map);
        mount(minimap);
    });
    it('tests handleMapMouseMove', function () {
        gameCanvas.isMouseDown = true;
        gameCanvas.lastKnownPositionInCanvasTermsX = 10;
        gameCanvas.lastKnownPositionInCanvasTermsY = 15;
        gameCanvas.handleMapMouseMove();
        var fnArg = gameCanvas.onViewMapMove.mock.calls[0][0];
        expect(fnArg.x).toBe(10);
        expect(fnArg.y).toBe(15);
        expect(fnArg.isMouseDown).toBe(true);
        gameCanvas.isMouseDown = false;
        gameCanvas.handleMapMouseMove();
        fnArg = gameCanvas.onViewMapMove.mock.calls[1][0];
        expect(fnArg.isMouseDown).toBe(false);
    });
    it('tests handleMapMouseUp', function () {
        gameCanvas.lastKnownPositionInCanvasTermsX = 10;
        gameCanvas.lastKnownPositionInCanvasTermsY = 15;
        gameCanvas.lastTap = 1;
        gameCanvas.handleMapMouseUp();
        expect(gameCanvas.onViewMapClick.mock.calls.length).toBe(0);
        gameCanvas.lastTap = 0;
        gameCanvas.handleMapMouseUp();
        var fnArg = gameCanvas.onViewMapClick.mock.calls[0][0];
        expect(fnArg.x).toBe(10);
        expect(fnArg.y).toBe(15);
    });
    it('tests handleMapMouseLeave, should trigger onViewMapClick', function () {
        gameCanvas.handleMapMouseLeave();
        expect(gameCanvas.onViewMapClick.mock.calls.length).toBe(0);
        gameCanvas.isMouseDown = true;
        gameCanvas.handleMapMouseLeave();
        expect(gameCanvas.onViewMapClick.mock.calls.length).toBe(1);
    });
    it('tests handleMapTouchEnd, should trigger onViewMapClick', function () {
        gameCanvas.handleMapTouchEnd();
        expect(gameCanvas.onViewMapClick.mock.calls.length).toBe(1);
    });
    it('tests updateViewMapCursorPosition, should populate lastKnownPositionInCanvasTermsX and lastKnownPositionInCanvasTermsY', function () {
        var canvas = {
            width: 100,
            height: 100,
            getBoundingClientRect: function () {
                return {
                    left: 0,
                    top: 0,
                    width: 100,
                    height: 100
                };
            }
        };
        var canvasAPI = {
            getPan: function () {
                return {
                    panX: 0,
                    panY: 0
                };
            }
        };
        gameCanvas.viewMapCanvas = canvas;
        gameCanvas.mapAPI = canvasAPI;
        gameCanvas.updateViewMapCursorPosition({
            x: 10, y: 10
        });
        expect(gameCanvas.lastKnownPositionInCanvasTermsX).toBe(10);
        expect(gameCanvas.lastKnownPositionInCanvasTermsY).toBe(10);
    });
    it('tests updateMiniMapCursorPosition, should populate miniMapX and miniMapY', function () {
        gameCanvas.updateMiniMapCursorPosition({ x: 10, y: 10 });
        expect(gameCanvas.miniMapX).toBe(10);
        expect(gameCanvas.miniMapY).toBe(10);
    });
    it('tests handleMapMouseDown, should set variables on instance', function () {
        gameCanvas.handleMapMouseDown();
    });
    it('tests handleMiniMapClick, Should trigger pan on the canvasAPI', function () {
        // The point of this test is to "centralize" the current X,Y
        gameCanvas.miniMapX = 50;
        gameCanvas.miniMapY = 50;
        var mocked = jest.spyOn(apis.mapAPI, 'pan');
        gameCanvas.handleMiniMapClick({});
        expect(mocked.mock.calls.length).toBe(1);
        expect(mocked.mock.calls[0]).toEqual([-25, -25]);
    });
    it('tests handleTouchMove, Should trigger pan on the canvasAPI', function () {
        var MAP_WIDTH = 1000;
        var MAP_HEIGHT = 1000;
        gameCanvas.lastKnownPositionInCanvasTermsX = 50;
        gameCanvas.lastKnownPositionInCanvasTermsY = 50;
        gameCanvas.mapWidth = MAP_WIDTH;
        gameCanvas.mapHeight = MAP_HEIGHT;
        var event = {
            preventDefault: function () { },
            touches: [
                {
                    clientX: 0,
                    clientY: 0
                }
            ]
        };
        var canvas = {
            width: MAP_WIDTH / 10,
            height: MAP_HEIGHT / 10,
            getBoundingClientRect: function () {
                return {
                    left: 0,
                    top: 0,
                    width: MAP_WIDTH,
                    height: MAP_HEIGHT
                };
            }
        };
        var canvasAPI = {
            getPan: function () {
                return {
                    panX: 0,
                    panY: 0
                };
            },
            pan: function (x, y) { }
        };
        gameCanvas.viewMapCanvas = canvas; // for tests we just want a small subset, so any is ok
        gameCanvas.mapAPI = canvasAPI;
        var mocked = jest.spyOn(gameCanvas.mapAPI, 'pan');
        gameCanvas.handleTouchMove(event);
        // first call, first argument(array) 1st and 2nd arg
        expect(mocked.mock.calls[0][0]).toBe(-50);
        expect(mocked.mock.calls[0][1]).toBe(-50);
        expect(gameCanvas.lastKnownPositionInCanvasTermsX).toBe(50);
        expect(gameCanvas.lastKnownPositionInCanvasTermsY).toBe(50);
    });
    it('tests handleTouchStart, ShouldW set lastKnownPositionInCanvasTermsX and lastKnownPositionInCanvasTermsY', function () {
        var event = {
            touches: [
                {
                    clientX: 10,
                    clientY: 10
                }
            ]
        };
        var canvas = {
            width: 100,
            height: 100,
            getBoundingClientRect: function () {
                return {
                    left: 0,
                    top: 0,
                    width: 100,
                    height: 100
                };
            }
        };
        var canvasAPI = {
            getPan: function () {
                return {
                    panX: 0,
                    panY: 0
                };
            }
        };
        gameCanvas.viewMapCanvas = canvas; // for tests we just want a small subset, so any is ok
        gameCanvas.mapAPI = canvasAPI; // for tests we just want a small subset, so any is ok
        gameCanvas.handleTouchStart(event);
        expect(gameCanvas.lastKnownPositionInCanvasTermsX).toBe(10);
        expect(gameCanvas.lastKnownPositionInCanvasTermsY).toBe(10);
    });
});
