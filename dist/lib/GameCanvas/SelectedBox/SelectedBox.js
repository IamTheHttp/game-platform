"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class that represents the current selected area by the user
 * Populated when the user click, holds and move the mouse
 */
var SelectedBox = /** @class */ (function () {
    function SelectedBox() {
        this.reset();
    }
    SelectedBox.prototype.reset = function () {
        this.start = {
            x: 0,
            y: 0
        };
        this.end = {
            x: 0,
            y: 0
        };
    };
    SelectedBox.prototype.getData = function () {
        return {
            start: Object.assign({}, this.start),
            end: Object.assign({}, this.end),
            width: this.getWidth(),
            height: this.getHeight()
        };
    };
    SelectedBox.prototype.getHeight = function () {
        return this.end.y - this.start.y;
    };
    SelectedBox.prototype.getWidth = function () {
        return this.end.x - this.start.x;
    };
    SelectedBox.prototype.setStart = function (x, y) {
        this.start.x = x;
        this.start.y = y;
    };
    SelectedBox.prototype.setEnd = function (x, y) {
        this.end.x = x;
        this.end.y = y;
    };
    return SelectedBox;
}());
exports.default = SelectedBox;
