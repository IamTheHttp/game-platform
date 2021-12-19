"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Circle = exports.Shape = void 0;
var Shape = /** @class */ (function () {
    function Shape(renderFn, metaData) {
        if (metaData === void 0) { metaData = {}; }
        this.layerName = 'initial';
        this.render = renderFn;
        this.metaData = metaData;
    }
    return Shape;
}());
exports.Shape = Shape;
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle(data, ctx) {
        var _this = this;
        var id = data.id, x = data.x, y = data.y, radius = data.radius, lineWidth = data.lineWidth, fillColor = data.fillColor, color = data.color, strokeStyle = data.strokeStyle;
        var shapeMetaData = { id: id, x: x, y: y, radius: radius, type: 'circle' };
        _this = _super.call(this, function () { return _this._render(); }, shapeMetaData) || this;
        _this.metaData = shapeMetaData;
        _this.id = id;
        _this.ctx = ctx;
        _this.x = x;
        _this.y = y;
        _this.radius = radius;
        _this.lineWidth = lineWidth;
        _this.fillColor = fillColor;
        _this.color = color || strokeStyle;
        return _this;
    }
    Circle.prototype._render = function () {
        var _a = this, ctx = _a.ctx, lineWidth = _a.lineWidth, x = _a.x, y = _a.y, radius = _a.radius, fillColor = _a.fillColor, color = _a.color;
        ctx.strokeStyle = color;
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
    };
    return Circle;
}(Shape));
exports.Circle = Circle;
