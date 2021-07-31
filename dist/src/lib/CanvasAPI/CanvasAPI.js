/**
 * Library for working with Canvas,
 * Works by using a 2D context as an argument
 * Provides abstraction for some common shapes in Canvas
 */
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import { Circle, Shape } from "./Shapes/Shape";
var CanvasAPI = /** @class */ (function () {
    function CanvasAPI(ctx, strokeStyle) {
        if (strokeStyle === void 0) { strokeStyle = 'white'; }
        if (!ctx) {
            throw 'Cannot create layer, no initial context found';
        }
        this.layers = {
            initial: {
                ctx: ctx,
                shapes: new Map()
            }
        };
        this.defaultStrokeStyle = strokeStyle;
        ctx.strokeStyle = strokeStyle;
    }
    CanvasAPI.prototype.addLayer = function (name) {
        var originCanvas = this.layers.initial.ctx.canvas;
        var parentNode = originCanvas.parentNode;
        var newCanvas = originCanvas.cloneNode();
        newCanvas.id = name;
        parentNode.insertBefore(newCanvas, originCanvas);
        this.layers[name] = {
            ctx: newCanvas.getContext('2d'),
            shapes: new Map()
        };
    };
    CanvasAPI.prototype.removeLayer = function (name) {
        var originCanvas = this.layers.initial.ctx.canvas;
        var parentNode = originCanvas.parentNode;
        parentNode.querySelector("#" + name).remove();
        delete this.layers[name];
    };
    /**
     * Clears all the shapes
     */
    CanvasAPI.prototype.clear = function (layerName) {
        if (layerName === void 0) { layerName = 'initial'; }
        var layer = this.layers[layerName];
        layer.shapes = new Map();
    };
    CanvasAPI.prototype.clearAllLayers = function () {
        for (var layerName in this.layers) {
            if (!this.layers.hasOwnProperty(layerName)) {
                continue;
            }
            this.clear(layerName);
        }
    };
    /**
     * Removes a shape by its ID
     * @param id
     * @param layerName
     */
    CanvasAPI.prototype.remove = function (id, layerName) {
        if (layerName === void 0) { layerName = 'initial'; }
        var layer = this.layers[layerName];
        var shapes = layer.shapes;
        shapes.delete(id);
    };
    /* istanbul ignore next */
    CanvasAPI.prototype.addImage = function (_a) {
        var id = _a.id, image = _a.image, // the image to display
        x = _a.x, y = _a.y, // pos for x,y..
        height = _a.height, width = _a.width, cropStartX = _a.cropStartX, cropStartY = _a.cropStartY, cropSizeX = _a.cropSizeX, cropSizeY = _a.cropSizeY, rotation = _a.rotation, // in radians
        _b = _a.layerName, // in radians
        layerName = _b === void 0 ? 'initial' : _b;
        var layer = this.layers[layerName];
        var ctx = layer.ctx;
        var shapes = layer.shapes;
        shapes.set(id, new Shape(function () {
            ctx.beginPath();
            ctx.save();
            ctx.translate(x + width / 2, y + height / 2);
            ctx.rotate(rotation);
            ctx.drawImage(image, cropStartX, cropStartY, cropSizeX, cropSizeY, -width / 2, -height / 2, // pos in canvas // at the top left of the canvas
            width, height); // size in canvas
            ctx.restore();
            ctx.closePath();
        }, {
            id: id,
            type: 'image',
            x: x,
            y: y,
            height: height,
            width: width
        }));
    };
    CanvasAPI.prototype.addShape = function (_a) {
        var id = _a.id, render = _a.render, _b = _a.layerName, layerName = _b === void 0 ? 'initial' : _b;
        var layer = this.layers[layerName];
        var ctx = layer.ctx;
        var shapes = layer.shapes;
        shapes.set(id, new Shape(function () {
            render(ctx);
        }));
    };
    CanvasAPI.prototype.writeBubble = function (_a) {
        var id = _a.id, text = _a.text, backgroundColor = _a.backgroundColor, borderColor = _a.borderColor, borderWidth = _a.borderWidth, fontSize = _a.fontSize, fontColor = _a.fontColor, x = _a.x, y = _a.y, fontFace = _a.fontFace, height = _a.height, width = _a.width, _b = _a.paddingLeft, paddingLeft = _b === void 0 ? 10 : _b, _c = _a.paddingTop, paddingTop = _c === void 0 ? 10 : _c, _d = _a.layerName, layerName = _d === void 0 ? 'initial' : _d;
        var longestTextWidth = 0;
        var linesOfText = text.split('\n');
        var fontPxSize = fontSize || +this.layers.initial.ctx.font.split('px')[0];
        var fontToUse = fontFace || +this.layers.initial.ctx.font.split('px')[1];
        // set it first for text-width calculations
        this.layers.initial.ctx.font = fontPxSize + "px " + fontToUse;
        for (var i = 0; i < linesOfText.length; i++) {
            var width_1 = this.layers[layerName].ctx.measureText(linesOfText[i]).width;
            longestTextWidth = width_1 > longestTextWidth ? width_1 : longestTextWidth;
        }
        this.addRect({
            id: "" + id,
            x: x,
            y: y,
            height: Math.max(height, linesOfText.length * fontPxSize + paddingTop * 2),
            width: Math.max(width, longestTextWidth + paddingLeft * 2 + borderWidth),
            fillColor: backgroundColor,
            lineWidth: borderWidth,
            strokeStyle: borderColor,
            layerName: layerName
        });
        for (var i = 0; i < linesOfText.length; i++) {
            this.write({
                id: id + "-bubbleText-" + i,
                text: linesOfText[i],
                x: x + paddingLeft,
                y: y + fontPxSize + paddingTop + i * fontPxSize,
                fillStyle: fontColor,
                font: fontPxSize + "px " + fontToUse,
                layerName: layerName,
                textBaseline: null,
                strokeStyle: null
            });
        }
    };
    CanvasAPI.prototype.addRect = function (_a) {
        var id = _a.id, x = _a.x, y = _a.y, width = _a.width, height = _a.height, strokeStyle = _a.strokeStyle, lineWidth = _a.lineWidth, fillColor = _a.fillColor, _b = _a.layerName, layerName = _b === void 0 ? 'initial' : _b;
        var layer = this.layers[layerName];
        if (!layer) {
            throw "Could not find layer '" + layerName + "', are you sure you created the layer?";
        }
        var ctx = layer.ctx;
        var shapes = layer.shapes;
        shapes.set(id, new Shape(function () {
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            if (fillColor) {
                ctx.fillStyle = fillColor;
                ctx.fill();
            }
            ctx.stroke();
            ctx.closePath();
        }, {
            id: id,
            type: 'rect',
            x: x,
            y: y,
            height: height,
            width: width
        }));
    };
    CanvasAPI.prototype.addArc = function (_a) {
        var id = _a.id, direction = _a.direction, size = _a.size, _b = _a.color, color = _b === void 0 ? 'black' : _b, fillColor = _a.fillColor, _c = _a.lineWidth, lineWidth = _c === void 0 ? 1 : _c, x = _a.x, y = _a.y, radius = _a.radius, _d = _a.layerName, layerName = _d === void 0 ? 'initial' : _d;
        var layer = this.layers[layerName];
        var ctx = layer.ctx;
        var shapes = layer.shapes;
        shapes.set(id, new Shape(function () {
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            var startArc = direction - (size / 2);
            var endArc = direction + (size / 2);
            ctx.beginPath();
            ctx.arc(x, y, radius, startArc * Math.PI, endArc * Math.PI);
            if (fillColor) {
                ctx.fillStyle = fillColor;
                ctx.fill();
            }
            ctx.stroke();
            ctx.closePath();
        }));
    };
    CanvasAPI.prototype.addCircle = function (_a) {
        var id = _a.id, x = _a.x, y = _a.y, radius = _a.radius, lineWidth = _a.lineWidth, color = _a.color, fillColor = _a.fillColor, _b = _a.layerName, layerName = _b === void 0 ? 'initial' : _b;
        var layer = this.layers[layerName];
        var ctx = layer.ctx;
        var shapes = layer.shapes;
        shapes.set(id, new Circle(id, x, y, radius, lineWidth, fillColor, color, ctx));
    };
    /**
     * Method allows us to pan around the canvas
     */
    CanvasAPI.prototype.pan = function (x, y) {
        this.panX = x;
        this.panY = y;
        for (var layerName in this.layers) {
            if (!this.layers.hasOwnProperty(layerName)) {
                continue;
            }
            var layer = this.layers[layerName];
            var ctx = layer.ctx;
            ctx.setTransform(1, 0, 0, 1, x, y);
            // non initial layers are drawn much less often, so we need a manual one here.
            if (layerName !== 'initial') {
                this.draw(layerName); // pan requires a draw to all non initial layers
            }
        }
    };
    CanvasAPI.prototype.getPan = function () {
        return {
            panX: this.panX || 0,
            panY: this.panY || 0,
        };
    };
    CanvasAPI.prototype.write = function (_a) {
        var id = _a.id, text = _a.text, x = _a.x, y = _a.y, _b = _a.font, font = _b === void 0 ? '' : _b, textBaseline = _a.textBaseline, fillStyle = _a.fillStyle, _c = _a.strokeStyle, strokeStyle = _c === void 0 ? '' : _c, _d = _a.layerName, layerName = _d === void 0 ? 'initial' : _d;
        var layer = this.layers[layerName];
        var ctx = layer.ctx;
        var shapes = layer.shapes;
        shapes.set(id, new Shape(function () {
            ctx.beginPath();
            ctx.font = font;
            ctx.textBaseline = textBaseline;
            ctx.fillStyle = fillStyle;
            ctx.strokeStyle = strokeStyle;
            ctx.fillText(text, x, y);
            ctx.closePath();
        }, {
            id: id,
            x: x,
            y: y
        }));
    };
    CanvasAPI.prototype.draw = function (layerName) {
        var e_1, _a;
        if (layerName === void 0) { layerName = 'initial'; }
        var layer = this.layers[layerName];
        var ctx = layer.ctx;
        var shapes = layer.shapes;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
        try {
            for (var _b = __values(shapes.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var shape = _c.value;
                shape.render(ctx);
                ctx.strokeStyle = this.defaultStrokeStyle;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return CanvasAPI;
}());
// adding an image causes segmentation fault for some reason :)
/* istanbul ignore next */
if (process.env.NODE_ENV === 'test') {
    CanvasAPI.prototype.addImage = function () {
    };
}
export default CanvasAPI;
