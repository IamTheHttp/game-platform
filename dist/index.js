(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("react")) : factory(root["react"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function(__WEBPACK_EXTERNAL_MODULE__0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/lib/ECS/util/entityLoop.ts
/**
 * used to loop over and possibly filter entities
 * Accepts either a map of Entities with EntitiyID as Key, or an array
 * if the CB returns true, an array of entities that return true is returned.
 * @param entities
 * @param fn
 * @returns {Array}
 */
/* harmony default export */ var entityLoop = (function (entities, fn) {
    var ents = [];
    if (entities.forEach) {
        entities.forEach(function (ent) {
            fn(ent) && ents.push(ent);
        });
    }
    else {
        Object.keys(entities).forEach(function (entID) {
            fn(entities[entID]) && ents.push(entities[entID]);
        });
    }
    return ents;
});

// CONCATENATED MODULE: ./src/lib/ECS/Group.ts
var __read = (undefined && undefined.__read) || function (o, n) {
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
var __spread = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};

var Group = /** @class */ (function () {
    function Group(components, entities) {
        if (entities === void 0) { entities = {}; }
        this.components = components;
        this.entities = entities;
        this.array = [];
    }
    return Group;
}());
Group.groups = {};
Group.reset = function () {
    Group.groups = {};
};
Group.generateGroupKey = function (components) {
    var names = [];
    for (var count = 0; count < components.length; count++) {
        var name_1 = components[count];
        names.push(name_1);
    }
    return names
        .map(function (x) {
        return x.toLowerCase();
    })
        .sort()
        .join('-');
};
Group.getGroup = function (components) {
    var key = Group.generateGroupKey(components);
    return Group.groups[key] || {};
};
// this will create a new index group for the provided components.
Group.indexGroup = function (compNames, entities) {
    var compArray = [];
    if (typeof compNames === 'string') {
        compArray = [compNames];
    }
    else {
        compArray = compNames;
    }
    var key = Group.generateGroupKey(compArray);
    var group;
    if (Group.groups[key]) {
        return;
    }
    else {
        group = Group.groups[key] = new Group(compArray);
    }
    // insert the provided entities into this group...
    entityLoop(entities, function (entity) {
        if (entity.hasComponents(compArray)) {
            group.entities[entity.id] = entity;
            group.array = __spread(group.array, [entity]);
        }
    });
    return group;
};
/* harmony default export */ var ECS_Group = (Group);
// life cycle of a group!
// 1. Adding a component adds a group with that one component.
// 2. Adding 2nd component creates a group with that 2nd component
// 3. Querying for a list of components should create an group for that list, one off.
// 4. Adding and removing components will update the above lists as needed.

// CONCATENATED MODULE: ./src/lib/ECS/Entity.ts


var spliceOne = function (arr, index) {
    if (index === void 0) { index = 0; }
    var idx = index;
    var len = arr.length;
    if (!len || idx >= len) {
        return;
    }
    while (idx < len) {
        arr[idx] = arr[idx + 1];
        idx++;
    }
    arr.length--;
};
/**
 * Entity class to a static interface
 *
 * entity.addComponent(Component component)
 *
 */
var Entity_Entity = /** @class */ (function () {
    function Entity(classRef) {
        Entity.counter++;
        this.id = Entity.counter;
        this.constructor = classRef;
        this.components = {};
        Entity.entities[this.id] = this;
    }
    Entity.prototype.assignGroup = function (group) {
        group.entities[this.id] = this;
    };
    // A component is added
    // we create a new group index, for exm
    Entity.prototype.addComponent = function (component) {
        this.components[component.name] = component;
        this[component.name] = component;
        // creates an index group if it does not exist..
        var arr = [];
        for (var compName in this.components) {
            arr.push(compName);
        }
        ECS_Group.indexGroup(arr, Entity.entities);
        // we need to see if we need to add entity into other groups.
        for (var groupKey in ECS_Group.groups) {
            var group = ECS_Group.groups[groupKey];
            // if the ent is in this group, skip.
            if (group.entities[this.id]) {
                continue;
            }
            // if the component is not in this group, skip.
            if (group.components.indexOf(component.name) === -1) {
                continue;
            }
            // if this ent does not have all the other comps, skip..
            if (this.hasComponents(group.components)) {
                this.assignGroup(group);
                var newGroup = this.copyArray(group);
                group.array = this.extendGroup(newGroup);
            }
        }
    };
    // that's not really copying the array now is it?
    Entity.prototype.copyArray = function (group) {
        return group.array;
    };
    Entity.prototype.extendGroup = function (newGroup) {
        newGroup[newGroup.length] = this;
        return newGroup;
    };
    // mixed, an actual component or just component name
    Entity.prototype.removeComponent = function (comp) {
        var component = this.components[comp] || comp;
        var compName = component.name;
        // we need to see if we need to remove entity from other groups
        for (var groupKey in ECS_Group.groups) {
            var group = ECS_Group.groups[groupKey];
            // if the ent is in this group, skip.
            var compInGroup = group.components.indexOf(component.name) > -1;
            var entHasReqComps = this.hasComponents(group.components);
            // if this ent does not have all the other comps, skip..
            if (group.entities[this.id] && compInGroup && entHasReqComps) {
                delete group.entities[this.id];
                spliceOne(group.array, group.array.indexOf(this));
            }
        }
        delete this.components[compName];
        delete this[compName];
    };
    /**
     * Destroying an entity means removing all its components and deleting it from the Entity Object
     */
    Entity.prototype.destroy = function () {
        var _this = this;
        Object.keys(this.components).forEach(function (compName) {
            _this.removeComponent(_this.components[compName]);
        });
        delete Entity.entities[this.id];
    };
    Entity.prototype.hasComponents = function (compNames) {
        var _this = this;
        if (compNames === void 0) { compNames = []; }
        // quick breakout if single
        if (typeof compNames === 'string') {
            if (this.components[compNames]) {
                return true;
            }
        }
        else {
            return compNames.reduce(function (agg, compName) {
                return agg && !!_this.components[compName];
            }, true);
        }
    };
    return Entity;
}());
Entity_Entity.entities = {};
/**
 * @param components
 * @param type 'array'|'map'
 * @return return array/map
 */
Entity_Entity.getByComps = function (components, type) {
    if (type === void 0) { type = 'array'; }
    var compNames = components;
    ECS_Group.indexGroup(components, Entity_Entity.entities);
    var group = ECS_Group.getGroup(compNames);
    return type === 'map' ? group.entities : group.array.concat();
};
Entity_Entity.reset = function () {
    entityLoop(Entity_Entity.entities, function (entity) {
        entity.destroy();
    });
    ECS_Group.reset();
};
Entity_Entity.counter = 0;
window.Entity = Entity_Entity;
/* harmony default export */ var ECS_Entity = (Entity_Entity);

// CONCATENATED MODULE: ./src/lib/ObjectPool/ObjectPool.ts
var ObjectPool = /** @class */ (function () {
    function ObjectPool(PooledClass, incrementWhenEmpty) {
        if (incrementWhenEmpty === void 0) { incrementWhenEmpty = 10; }
        this.type = PooledClass;
        this.freePool = [];
        this.stats = {
            free: 0,
            used: 0
        };
        this.incrementWhenEmpty = incrementWhenEmpty;
    }
    ObjectPool.prototype.reset = function () {
        this.freePool = [];
        this.stats = {
            free: 0,
            used: 0
        };
    };
    // Ensures the pool has at least $amount of free objects
    ObjectPool.prototype.generate = function (amount) {
        var count = amount - this.stats.free > 0 ? amount - this.stats.free : 0;
        // generate a gazzilion fighters?
        while (count > 0) {
            this.freePool.push(new this.type());
            count--;
        }
        this.stats.free = this.freePool.length;
    };
    // acquires an object, marks it as 'used'.
    ObjectPool.prototype.acquire = function () {
        if (this.freePool.length === 0) {
            this.generate(this.incrementWhenEmpty);
        }
        var obj = this.freePool.pop();
        this.stats.free = this.freePool.length;
        return obj;
    };
    // releases an object, marks it as free
    ObjectPool.prototype.release = function (object) {
        // prevent release twice
        if (this.freePool.indexOf(object) === -1) {
            this.freePool.push(object);
            this.stats.free = this.freePool.length;
        }
    };
    return ObjectPool;
}());
/* harmony default export */ var ObjectPool_ObjectPool = (ObjectPool);

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(0);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);

// CONCATENATED MODULE: ./src/lib/CanvasAPI/CanvasAPI.ts
var __values = (undefined && undefined.__values) || function(o) {
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
/**
 * Library for working with Canvas,
 * Works by using a 2D context as an argument
 * Provides abstraction for some common shapes in Canvas
 */
var Shape = /** @class */ (function () {
    function Shape(draw, metaData) {
        if (metaData === void 0) { metaData = {}; }
        this.draw = draw;
        this.metaData = metaData;
    }
    return Shape;
}());

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
        var ctx = layer.ctx;
        layer.shapes = new Map();
    };
    CanvasAPI.prototype.clearAllLayers = function () {
        for (var layerName in this.layers) {
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
        var ctx = layer.ctx;
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
    // TODO Finish this API
    CanvasAPI.prototype.addShape = function (_a) {
        var id = _a.id, drawFn = _a.drawFn, _b = _a.layerName, layerName = _b === void 0 ? 'initial' : _b;
        var layer = this.layers[layerName];
        var ctx = layer.ctx;
        var shapes = layer.shapes;
        shapes.set(id, new Shape(function () {
            drawFn(ctx);
        }));
    };
    CanvasAPI.prototype.writeBubble = function (_a) {
        var id = _a.id, text = _a.text, backgroundColor = _a.backgroundColor, borderColor = _a.borderColor, borderWidth = _a.borderWidth, fontSize = _a.fontSize, fontColor = _a.fontColor, x = _a.x, y = _a.y, fontFace = _a.fontFace, height = _a.height, width = _a.width, _b = _a.paddingLeft, paddingLeft = _b === void 0 ? 10 : _b, _c = _a.paddingTop, paddingTop = _c === void 0 ? 10 : _c, _d = _a.layerName, layerName = _d === void 0 ? 'initial' : _d;
        var longestTextWidth = 0;
        var linesOfText = text.split('\n');
        var fontPxSize = fontSize || this.layers.initial.ctx.font.split('px')[0];
        var fontToUse = fontFace || this.layers.initial.ctx.font.split('px')[1];
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
        shapes.set(id, new Shape(function () {
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
        }, {
            id: id,
            type: 'circle',
            x: x,
            y: y,
            radius: radius
        }));
    };
    /**
     * Method allows us to pan around the canvas
     */
    CanvasAPI.prototype.pan = function (x, y) {
        this.panX = x;
        this.panY = y;
        for (var layerName in this.layers) {
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
                shape.draw();
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
if (false) {}
/* harmony default export */ var CanvasAPI_CanvasAPI = (CanvasAPI);

// CONCATENATED MODULE: ./src/lib/GameCanvas/SelectedBox/SelectedBox.ts
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
/* harmony default export */ var SelectedBox_SelectedBox = (SelectedBox);

// CONCATENATED MODULE: ./src/lib/GameCanvas/selectionUtils/isPosInsideCircle.ts
/**
 * Utility function to detect if a point is inside a circle
 * @param x
 * @param y
 * @param centerX
 * @param centerY
 * @param radius
 * @return {boolean}
 */
function isPosInsideCircle(x, y, centerX, centerY, radius) {
    return Math.pow((x - centerX), 2) + Math.pow((y - centerY), 2) < Math.pow(radius, 2);
}
/* harmony default export */ var selectionUtils_isPosInsideCircle = (isPosInsideCircle);

// CONCATENATED MODULE: ./src/lib/GameCanvas/selectionUtils/getShapesFromClick.ts

/**
 * Function used for getting all shapes hit from a single click (not from a selection box)
 */
function getShapesFromClick(shapes, layerName, x, y) {
    var hits = [];
    shapes.forEach(function (shape, id) {
        if (id === 'selectedBox') {
            return;
        }
        var shapeMetaData = shape.metaData || {};
        var shapeX = shapeMetaData.x;
        var shapeY = shapeMetaData.y;
        var radius = shapeMetaData.radius;
        var width = shapeMetaData.width;
        var height = shapeMetaData.height;
        var type = shapeMetaData.type;
        if (type === 'circle' && selectionUtils_isPosInsideCircle(x, y, shapeX, shapeY, radius)) {
            hits.push({
                id: id,
                layerName: layerName
            });
        }
        else if (type === 'rect' || type === 'image') {
            if (x >= shapeX && x <= shapeX + width && y >= shapeY && y <= shapeY + height) {
                hits.push({
                    id: id,
                    layerName: layerName
                });
                // do nothing, no support for non circles
            }
        }
        else if (type !== 'circle') {
        }
    });
    return hits;
}
/* harmony default export */ var selectionUtils_getShapesFromClick = (getShapesFromClick);

// CONCATENATED MODULE: ./src/lib/GameCanvas/selectionUtils/getShapesInSelectionBox.ts
function getShapesInSelectionBox(shapes, layerName, selectedData) {
    var minX = Math.min(selectedData.start.x, selectedData.end.x);
    var maxX = Math.max(selectedData.start.x, selectedData.end.x);
    var minY = Math.min(selectedData.start.y, selectedData.end.y);
    var maxY = Math.max(selectedData.start.y, selectedData.end.y);
    var hits = [];
    shapes.forEach(function (shape, id) {
        if (id === 'selectedBox') {
            return;
        }
        var shapeMetaData = shape.metaData || {};
        var shapeX = shapeMetaData.x;
        var shapeY = shapeMetaData.y;
        var radius = shapeMetaData.radius;
        var width = shapeMetaData.width;
        var height = shapeMetaData.height;
        var type = shapeMetaData.type;
        if (type === 'circle') {
            var centerX = shapeX;
            var centerY = shapeY;
            if (centerX >= minX && centerX <= maxX && centerY >= minY && centerY <= maxY) {
                hits.push({
                    id: id,
                    layerName: layerName
                });
            }
        }
        else if (type === 'rect' || type === 'image') {
            // what is considered the 'centerX' for a rect?
            var centerX = shapeX + width / 2;
            var centerY = shapeY + height / 2;
            if (centerX >= minX && centerX <= maxX && centerY >= minY && centerY <= maxY) {
                hits.push({
                    id: id,
                    layerName: layerName
                });
            }
        }
        else {
            // do nothing, no support for non circles or rects
        }
    });
    return hits;
}
/* harmony default export */ var selectionUtils_getShapesInSelectionBox = (getShapesInSelectionBox);

// CONCATENATED MODULE: ./src/lib/GameCanvas/GameCanvas.tsx
var GameCanvas_read = (undefined && undefined.__read) || function (o, n) {
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
var GameCanvas_spread = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(GameCanvas_read(arguments[i]));
    return ar;
};





var GameCanvas_GameCanvas = /** @class */ (function () {
    function GameCanvas(options) {
        var noop = function () {
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
        this.selectedBox = new SelectedBox_SelectedBox();
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
    GameCanvas.prototype.updateCursorPosition = function (event, canvas, canvasAPI) {
        var rect = canvas.getBoundingClientRect();
        // base position
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        x = Math.max(0, Math.round(x * (canvas.width / rect.width))) - canvasAPI.getPan().panX;
        y = Math.max(0, Math.round(y * (canvas.height / rect.height))) - canvasAPI.getPan().panY;
        return { x: x, y: y };
    };
    GameCanvas.prototype.handleMapMouseMove = function () {
        if (this.isMouseDown) {
            if (this.enableSelectBox === false) {
                return;
            }
            else {
                this.selectedBox.setEnd(this.viewMapX, this.viewMapY);
                var data = this.selectedBox.getData();
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
            x: this.viewMapX,
            y: this.viewMapY,
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
                var x = _this.viewMapX;
                var y = _this.viewMapY;
                hits = GameCanvas_spread(hits, selectionUtils_getShapesFromClick(_this.mapAPI.layers[layerName].shapes, layerName, x, y));
            }
            else {
                hits = GameCanvas_spread(hits, selectionUtils_getShapesInSelectionBox(_this.mapAPI.layers[layerName].shapes, layerName, selectedData));
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
            x: this.viewMapX,
            y: this.viewMapY,
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
    GameCanvas.prototype.updateViewMapCursorPosition = function (event) {
        var _a = this.updateCursorPosition(event, this.viewMapCanvas, this.mapAPI), x = _a.x, y = _a.y;
        this.viewMapX = x;
        this.viewMapY = y;
    };
    GameCanvas.prototype.updateMiniMapCursorPosition = function (event) {
        var _a = this.updateCursorPosition(event, this.miniMapCanvas, this.miniMapAPI), x = _a.x, y = _a.y;
        this.miniMapX = x;
        this.miniMapY = y;
    };
    GameCanvas.prototype.getNewCanvasPairs = function (_a) {
        var getMapRef = _a.getMapRef, getMiniRef = _a.getMiniRef;
        return {
            map: this.generateMapCanvas(getMapRef),
            minimap: this.generateMiniMapCanvas(getMiniRef)
        };
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
        this.mapAPI.pan(-calcPanX, -calcPanY);
        // draw the minimap square box
        this.updateMiniMapSquare();
        this.onMiniMapClick(event);
    };
    GameCanvas.prototype.updateMiniMapSquare = function () {
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
        this.selectedBox.setStart(this.viewMapX, this.viewMapY);
        this.selectedBox.setEnd(this.viewMapX, this.viewMapY);
    };
    GameCanvas.prototype.handleTouchStart = function (e) {
        var _a = this.updateCursorPosition(e.touches[0], this.viewMapCanvas, this.mapAPI), x = _a.x, y = _a.y;
        var now = new Date().getTime();
        this.dbTap = (now - this.lastTap) < 300;
        this.lastTap = now;
        this.viewMapX = x;
        this.viewMapY = y;
        this.setSelectBox();
    };
    GameCanvas.prototype.handleMiniMapTouchStart = function (e) {
        var _a = this.updateCursorPosition(e.touches[0], this.miniMapCanvas, this.miniMapAPI), x = _a.x, y = _a.y;
        this.miniMapX = x;
        this.miniMapY = y;
        this.handleMiniMapClick(e);
    };
    GameCanvas.prototype.handleTouchMove = function (e) {
        e.preventDefault();
        var _a = this.updateCursorPosition(e.touches[0], this.viewMapCanvas, this.mapAPI), x = _a.x, y = _a.y;
        var calcPanX;
        var calcPanY;
        var _b = this.mapAPI.getPan(), panX = _b.panX, panY = _b.panY;
        var xMoved = x - this.viewMapX;
        var yMoved = y - this.viewMapY;
        calcPanX = panX + xMoved;
        calcPanY = panY + yMoved;
        // both numbers should be negative
        calcPanX = Math.min(calcPanX, 0);
        calcPanY = Math.min(calcPanY, 0);
        // the panning + the mapSize, should not exceed the viewSize
        var width = this.mapWidth;
        var height = this.mapHeight;
        calcPanX = -calcPanX + this.viewWidth < width ? calcPanX : this.viewWidth - width;
        calcPanY = -calcPanY + this.viewHeight < height ? calcPanY : this.viewHeight - height;
        this.mapAPI.pan(calcPanX, calcPanY);
    };
    GameCanvas.prototype.generateMapCanvas = function (getRef) {
        var _this = this;
        return (external_react_default.a.createElement("canvas", { className: 'viewMap', ref: function (el) {
                if (!el) {
                    return null;
                }
                if (false) {}
                _this.viewMapCanvas = el;
                document.removeEventListener('mousemove', _this.updateViewMapCursorPosition);
                document.addEventListener('mousemove', _this.updateViewMapCursorPosition);
                el.removeEventListener('touchmove', _this.handleTouchMove, false);
                el.addEventListener('touchmove', _this.handleTouchMove, false);
                _this.mapAPI = new CanvasAPI_CanvasAPI(el.getContext('2d'));
                getRef(_this.mapAPI, el);
            }, height: this.viewHeight, width: this.viewWidth, onMouseDown: this.handleMapMouseDown, onTouchStart: this.handleTouchStart, onTouchEnd: this.handleMapTouchEnd, onMouseMove: this.handleMapMouseMove, onMouseUp: this.handleMapMouseUp, onMouseLeave: this.handleMapMouseLeave }));
    };
    GameCanvas.prototype.generateMiniMapCanvas = function (getRef) {
        var _this = this;
        return (external_react_default.a.createElement("canvas", { className: 'minimap', ref: function (el) {
                if (!el) {
                    return null;
                }
                if (false) {}
                _this.miniMapCanvas = el;
                document.removeEventListener('mousemove', _this.updateMiniMapCursorPosition);
                document.addEventListener('mousemove', _this.updateMiniMapCursorPosition);
                _this.miniMapAPI = new CanvasAPI_CanvasAPI(el.getContext('2d'));
                // TODO - what? why? is this needed?
                var key = setInterval(function () {
                    if (_this.mapAPI) {
                        _this.updateMiniMapSquare();
                        clearInterval(key);
                    }
                }, 100);
                getRef(_this.miniMapAPI, el);
            }, height: this.mapHeight, width: this.mapWidth, onMouseMove: this.handleMiniMapMove, onMouseDown: this.handleMiniMapClick, onTouchStart: this.handleMiniMapTouchStart }));
    };
    return GameCanvas;
}());
/* harmony default export */ var lib_GameCanvas_GameCanvas = (GameCanvas_GameCanvas);

// CONCATENATED MODULE: ./src/lib/Engine/Engine.ts
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
            var systemArguments = typeof sysArgs === 'function' ? sysArgs() : sysArgs;
            _this.runSystems(systemArguments);
        });
        return this.frameID;
    };
    Engine.prototype.runSystems = function (systemArguments) {
        for (var i = 0; i < this.systems.length; i++) {
            this.systems[i](systemArguments);
        }
    };
    Engine.prototype.stop = function () {
        cancelAnimationFrame(this.frameID);
        return this.frameID;
    };
    return Engine;
}());
/* harmony default export */ var Engine_Engine = (Engine);

// CONCATENATED MODULE: ./src/index.ts
/* concated harmony reexport Entity */__webpack_require__.d(__webpack_exports__, "Entity", function() { return ECS_Entity; });
/* concated harmony reexport entityLoop */__webpack_require__.d(__webpack_exports__, "entityLoop", function() { return entityLoop; });
/* concated harmony reexport ObjectPool */__webpack_require__.d(__webpack_exports__, "ObjectPool", function() { return ObjectPool_ObjectPool; });
/* concated harmony reexport GameCanvas */__webpack_require__.d(__webpack_exports__, "GameCanvas", function() { return lib_GameCanvas_GameCanvas; });
/* concated harmony reexport Engine */__webpack_require__.d(__webpack_exports__, "Engine", function() { return Engine_Engine; });





/* harmony default export */ var src = __webpack_exports__["default"] = ({
    Entity: ECS_Entity,
    entityLoop: entityLoop,
    ObjectPool: ObjectPool_ObjectPool,
    GameCanvas: lib_GameCanvas_GameCanvas,
    Engine: Engine_Engine
});



/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map