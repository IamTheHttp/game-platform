"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var SelectedBox_1 = __importDefault(require("./SelectedBox/SelectedBox"));
var getShapesFromClick_1 = __importDefault(require("./selectionUtils/getShapesFromClick"));
var getShapesInSelectionBox_1 = __importDefault(require("./selectionUtils/getShapesInSelectionBox"));
var Painter_1 = require("../PainterAPI/Painter");
/**
 * This class is responsible for hooking the canvas events to the PainterAPI.
 */
var GameCanvas = /** @class */ (function () {
    function GameCanvas(options) {
        var noop = function () { };
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
        this.selectedBox = new SelectedBox_1.default();
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
     * @param PainterAPI
     */
    GameCanvas.prototype.getCursorPositionInCanvasTerms = function (clientInputCoordinates, canvas, PainterAPI) {
        var rect = canvas.getBoundingClientRect();
        if (typeof clientInputCoordinates.x !== 'number' || typeof clientInputCoordinates.y !== 'number') {
            throw 'Invalid inputCoordinates provided, missing X or Y';
        }
        // X/Y represent the point inside the client view that was touched.
        // this ignores scrolling, so the top left corner will always be 0,0 no matter the scroll
        // this X,Y is not yet scaled for canvas
        var rawXOnCanvasElement = clientInputCoordinates.x - rect.left;
        var rawYyOnCanvasElement = clientInputCoordinates.y - rect.top;
        // we need to scale the touch point with the real dimensions.
        // the HTML element can be 100px wide, but the Canvas within can be 1000px wide.
        // this ratio will allow us to correctly set the X,Y touch point
        var WIDTH_RATIO = canvas.width / rect.width;
        var HEIGHT_RATIO = canvas.height / rect.height;
        var scaledX = Math.max(0, Math.round(rawXOnCanvasElement * WIDTH_RATIO));
        var scaledY = Math.max(0, Math.round(rawYyOnCanvasElement * HEIGHT_RATIO));
        // Now we're in scaled canvas X,Y terms, we can safely subtract the Pan to get the right position
        var x = scaledX - PainterAPI.getCurrentPanValue().panX;
        var y = scaledY - PainterAPI.getCurrentPanValue().panY;
        return { x: x, y: y };
    };
    GameCanvas.prototype.handleMapMouseMove = function () {
        if (this.isMouseDown) {
            if (this.enableSelectBox === false) {
                return;
            }
            else {
                this.selectedBox.setEnd(this.lastKnownPositionInCanvasTermsX, this.lastKnownPositionInCanvasTermsY);
                var data = this.selectedBox.getData();
                this.mapAPI.drawRect({
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
    };
    GameCanvas.prototype.handleMapMouseLeave = function () {
        if (this.isMouseDown) {
            this.handleMapMouseUp();
        }
    };
    GameCanvas.prototype.handleMapTouchEnd = function () {
        var _this = this;
        this.isMouseDown = false;
        var selectedData = this.selectedBox.getData();
        var layers = Object.keys(this.mapAPI.layers);
        var hits = [];
        // if a single click...
        layers.forEach(function (layerName) {
            if (selectedData.end.x === selectedData.start.x) {
                var x = _this.lastKnownPositionInCanvasTermsX;
                var y = _this.lastKnownPositionInCanvasTermsY;
                hits = __spreadArray(__spreadArray([], __read(hits), false), __read((0, getShapesFromClick_1.default)(_this.mapAPI.layers[layerName].shapes, layerName, x, y)), false);
            }
            else {
                hits = __spreadArray(__spreadArray([], __read(hits), false), __read((0, getShapesInSelectionBox_1.default)(_this.mapAPI.layers[layerName].shapes, layerName, selectedData)), false);
            }
        });
        this.mapAPI.drawRect({
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
            hits: hits
        });
        this.selectedBox.reset();
    };
    GameCanvas.prototype.handleMapMouseUp = function () {
        if (!this.lastTap) {
            this.handleMapTouchEnd();
        }
    };
    GameCanvas.prototype.updateViewMapCursorPosition = function (inputCoordinates) {
        var _a = this.getCursorPositionInCanvasTerms(inputCoordinates, this.viewMapCanvas, this.mapAPI), x = _a.x, y = _a.y;
        this.lastKnownPositionInCanvasTermsX = x;
        this.lastKnownPositionInCanvasTermsY = y;
        return { x: x, y: y };
    };
    GameCanvas.prototype.updateMiniMapCursorPosition = function (inputCoordinates) {
        var _a = this.getCursorPositionInCanvasTerms(inputCoordinates, this.miniMapCanvas, this.miniMapAPI), x = _a.x, y = _a.y;
        this.miniMapX = x;
        this.miniMapY = y;
    };
    GameCanvas.prototype.handleMiniMapMove = function (event) {
        this.onMiniMapMove(event);
    };
    GameCanvas.prototype.handleMiniMapClick = function (event) {
        var x = this.miniMapX;
        var y = this.miniMapY;
        // Handle negative overflows, both numbers should be positive
        // the reason we divide in 2 is because we want to center the view
        var calcPanX = Math.max(x - this.viewWidth / 2, 0);
        var calcPanY = Math.max(y - this.viewHeight / 2, 0);
        // Handle positive overflows, both numbers should not exceed map size
        var width = this.mapWidth;
        var height = this.mapHeight;
        calcPanX = calcPanX + this.viewWidth < width ? calcPanX : width - this.viewWidth;
        calcPanY = calcPanY + this.viewHeight < height ? calcPanY : height - this.viewHeight;
        this.mapAPI.panCamera(-calcPanX, -calcPanY);
        // draw the minimap square box
        this.updateMiniMapSquare();
        this.onMiniMapClick(event);
    };
    GameCanvas.prototype.updateMiniMapSquare = function () {
        this.miniMapAPI.drawRect({
            fillColor: null,
            layerName: "initial",
            id: 'currentMap',
            x: -this.mapAPI.getCurrentPanValue().panX,
            y: -this.mapAPI.getCurrentPanValue().panY,
            width: this.viewWidth,
            height: this.viewHeight,
            strokeStyle: 'green',
            lineWidth: 20
        });
    };
    GameCanvas.prototype.handleMapMouseDown = function () {
        if (!this.lastTap) {
            var now = new Date().getTime();
            this.dbClick = (now - this.lastClick) < 300;
            this.lastClick = now;
            this.isMouseDown = true;
            this.setSelectBox();
        }
    };
    GameCanvas.prototype.setSelectBox = function () {
        if (this.enableSelectBox === false) {
            return;
        }
        this.selectedBox.setStart(this.lastKnownPositionInCanvasTermsX, this.lastKnownPositionInCanvasTermsY);
        this.selectedBox.setEnd(this.lastKnownPositionInCanvasTermsX, this.lastKnownPositionInCanvasTermsY);
    };
    GameCanvas.prototype.handleTouchStart = function (e) {
        var coords = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        this.updateViewMapCursorPosition(coords);
        var _a = this.getCursorPositionInCanvasTerms(coords, this.viewMapCanvas, this.mapAPI), x = _a.x, y = _a.y;
        var now = new Date().getTime();
        this.dbTap = (now - this.lastTap) < 300;
        this.lastTap = now;
        this.setSelectBox();
    };
    GameCanvas.prototype.handleMiniMapTouchStart = function (e) {
        var coords = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        var _a = this.getCursorPositionInCanvasTerms(coords, this.miniMapCanvas, this.miniMapAPI), x = _a.x, y = _a.y;
        this.miniMapX = x;
        this.miniMapY = y;
        this.handleMiniMapClick(e);
    };
    GameCanvas.prototype.ensureNegative = function (a) {
        return Math.min(a, 0);
    };
    // Clicking / Touching the minimap should pan the main view
    GameCanvas.prototype.handleTouchMove = function (e) {
        e.preventDefault();
        // Canvas terms include
        var coords = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        var _a = this.getCursorPositionInCanvasTerms(coords, this.viewMapCanvas, this.mapAPI), x = _a.x, y = _a.y;
        var _b = this.mapAPI.getCurrentPanValue(), currentPanX = _b.panX, currentPanY = _b.panY;
        // example: current is 5, lastKnown is 20, we moved -15.
        var xPxChange = x - this.lastKnownPositionInCanvasTermsX;
        var yPxChange = y - this.lastKnownPositionInCanvasTermsY;
        // the new pan is the current pan + the change in movement
        var plannedNewPanX = currentPanX + xPxChange;
        var plannedNewPanY = currentPanY + yPxChange;
        // We must ensure we don't escape from the bottom-right
        var IS_PANNING_CONTAINED_WITHIN_MAP_FOR_X = plannedNewPanX + this.viewWidth < this.mapWidth;
        var IS_PANNING_CONTAINED_WITHIN_MAP_FOR_Y = plannedNewPanY + this.viewWidth < this.mapHeight;
        // Max allowed panning will ensure we can't over-pan on the bottom right
        var MAX_ALLOWED_X_PANNING = this.viewWidth - this.mapWidth;
        var MAX_ALLOWED_Y_PANNING = this.viewHeight - this.mapHeight;
        var newPanX = IS_PANNING_CONTAINED_WITHIN_MAP_FOR_X ? plannedNewPanX : MAX_ALLOWED_X_PANNING;
        var newPanY = IS_PANNING_CONTAINED_WITHIN_MAP_FOR_Y ? plannedNewPanY : MAX_ALLOWED_Y_PANNING;
        // SAFETY
        // our panning is always negative, as don't allow to scroll off the edges
        // (if panning could be positive, we the canvas edge would be in the mainView)
        // This is equal to MIN_ALLOWED_X_PANNING = 0;
        this.mapAPI.panCamera(this.ensureNegative(newPanX), this.ensureNegative(newPanY));
    };
    GameCanvas.prototype.registerCanvasPair = function (mainMapCanvas, miniMapCanvas) {
        return {
            map: this.registerMapCanvas(mainMapCanvas),
            minimap: this.registerMinimapCanvas(miniMapCanvas)
        };
    };
    GameCanvas.prototype.registerMinimapCanvas = function (canvas) {
        var _this = this;
        this.miniMapCanvas = canvas;
        document.removeEventListener('mousemove', this.updateMiniMapCursorPosition);
        document.addEventListener('mousemove', this.updateMiniMapCursorPosition);
        // updateMiniMapSquare depends on mapAPI to be defined
        // due to some race conditions this might happen before mapAPI was defined
        // An interval is used to detect when mapAPI is defined
        var key = setInterval(function () {
            if (_this.mapAPI) {
                _this.updateMiniMapSquare();
                clearInterval(key);
            }
        }, 100);
        canvas.height = this.mapHeight;
        canvas.width = this.mapWidth;
        // @ts-ignore For some reason there's a misamtch between the event types TODO - can this be improved?
        canvas.addEventListener('mousemove', this.handleMiniMapMove);
        // @ts-ignore For some reason there's a misamtch between the event types TODO - can this be improved?
        canvas.addEventListener('mousedown', this.handleMiniMapClick);
        // @ts-ignore For some reason there's a misamtch between the event types TODO - can this be improved?
        canvas.addEventListener('touchstart', this.handleMiniMapTouchStart);
        this.miniMapAPI = new Painter_1.Painter(canvas.getContext('2d'));
        return this.miniMapAPI;
    };
    GameCanvas.prototype.registerMapCanvas = function (canvas) {
        this.viewMapCanvas = canvas;
        document.removeEventListener('mousemove', this.updateViewMapCursorPosition);
        document.addEventListener('mousemove', this.updateViewMapCursorPosition);
        // @ts-ignore For some reason there's a misamtch between the event types TODO - can this be improved?
        canvas.removeEventListener('touchmove', this.handleTouchMove, false);
        // @ts-ignore For some reason there's a misamtch between the event types TODO - can this be improved?
        canvas.addEventListener('touchmove', this.handleTouchMove, false);
        canvas.height = this.viewHeight;
        canvas.width = this.viewWidth;
        canvas.addEventListener('mousedown', this.handleMapMouseDown);
        canvas.addEventListener('mousemove', this.handleMapMouseMove);
        // @ts-ignore For some reason there's a misamtch between the event types TODO - can this be improved?
        canvas.addEventListener('touchstart', this.handleTouchStart);
        canvas.addEventListener('touchend', this.handleMapTouchEnd);
        canvas.addEventListener('mouseup', this.handleMapMouseUp);
        canvas.addEventListener('mouseleave', this.handleMapMouseLeave);
        this.mapAPI = new Painter_1.Painter(canvas.getContext('2d'));
        return this.mapAPI;
    };
    return GameCanvas;
}());
exports.default = GameCanvas;
