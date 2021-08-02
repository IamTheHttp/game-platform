"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Engine = /** @class */ (function () {
    function Engine() {
        this.systems = [];
        this.frameID = null;
    }
    Engine.prototype.addSystem = function (system) {
        this.systems.push(system);
    };
    Engine.prototype.run = function (sysArgs) {
        var _this = this;
        this.frameID = requestAnimationFrame(function () {
            _this.run(sysArgs); // // Load the next frame request, this will allow any system to cancel the frame
            var normalizedSysArgs = typeof sysArgs === 'function' ? sysArgs() : sysArgs;
            _this.runSystems(normalizedSysArgs);
        });
        return this.frameID;
    };
    Engine.prototype.runSystems = function (sysArgs) {
        for (var i = 0; i < this.systems.length; i++) {
            this.systems[i](sysArgs);
        }
    };
    Engine.prototype.stop = function () {
        cancelAnimationFrame(this.frameID);
        return this.frameID;
    };
    return Engine;
}());
exports.default = Engine;
