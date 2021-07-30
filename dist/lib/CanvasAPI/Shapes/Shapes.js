var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Shapes = /** @class */ (function () {
    function Shapes(draw, metaData) {
        if (metaData === void 0) { metaData = {}; }
        this.draw = draw;
        this.metaData = metaData;
    }
    return Shapes;
}());
export { Shapes };
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle(id, x, y, radius, lineWidth, fillColor, color, ctx) {
        var _this = this;
        var shapeMetaData = { id: id, x: x, y: y, radius: radius, type: 'circle' };
        _this = _super.call(this, function () { return _this._draw(); }, shapeMetaData) || this;
        _this.metaData = shapeMetaData;
        _this.id = id;
        _this.ctx = ctx;
        _this.x = x;
        _this.y = y;
        _this.radius = radius;
        _this.lineWidth = lineWidth;
        _this.fillColor = fillColor;
        _this.color = color;
        return _this;
    }
    Circle.prototype._draw = function () {
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
}(Shapes));
export { Circle };
