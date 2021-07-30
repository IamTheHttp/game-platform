'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () {
                        return e[k];
                    }
                });
            }
        });
    }
    n['default'] = e;
    return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
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
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/**
 * used to loop over and possibly filter entities
 * Accepts either a map of Entities with EntitiyID as Key, or an array
 * if the CB returns true, an array of entities that return true is returned.
 * @param entities
 * @param fn
 * @returns {Array}
 */
var entityLoop = (function (entities, fn) {
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

// life cycle of a group!
// 1. Adding a component adds a group with that one component.
// 2. Adding 2nd component creates a group with that 2nd component
// 3. Querying for a list of components should create an group for that list, one off.
// 4. Adding and removing components will update the above lists as needed.
var Group = /** @class */ (function () {
    function Group(components, entities, array) {
        if (entities === void 0) { entities = {}; }
        if (array === void 0) { array = []; }
        this.components = components;
        this.entities = entities;
        this.array = array;
    }
    Group.reset = function () {
        Group.groups = {};
    };
    Group.generateGroupKey = function (compNames) {
        var names = [];
        for (var count = 0; count < compNames.length; count++) {
            var name = compNames[count];
            names.push(name);
        }
        return names
            .map(function (x) {
            return x.toLowerCase();
        })
            .sort()
            .join('-');
    };
    Group.getGroup = function (compNames) {
        var key = Group.generateGroupKey(compNames);
        return Group.groups[key] || {};
    };
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
        // if group already exists, return it
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
    Group.groups = {};
    return Group;
}());

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

var Entity = /** @class */ (function () {
    function Entity(classRef) {
        this.id = Entity.counter;
        this.constructor = classRef;
        this.components = {};
        Entity.entities[this.id] = this;
        Entity.counter++;
    }
    Entity.reset = function () {
        entityLoop(Entity.entities, function (entity) {
            entity.destroy();
        });
        Group.reset();
    };
    Entity.getByComps = function (components, type) {
        if (type === void 0) { type = 'array'; }
        var compNames = components;
        Group.indexGroup(components, Entity.entities);
        var group = Group.getGroup(compNames);
        return type === 'map' ? group.entities : group.array.concat();
    };
    Entity.getByComp = function (compName, type) {
        return Entity.getByComps([compName]);
    };
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
            if (this.components.hasOwnProperty(compName)) {
                arr.push(compName);
            }
        }
        Group.indexGroup(arr, Entity.entities);
        // we need to see if we need to add entity into other groups.
        for (var groupKey in Group.groups) {
            if (!Group.groups.hasOwnProperty(groupKey)) {
                continue;
            }
            var group = Group.groups[groupKey];
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
        for (var groupKey in Group.groups) {
            if (!Group.groups.hasOwnProperty(groupKey)) {
                continue;
            }
            var group = Group.groups[groupKey];
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
    Entity.prototype.normalizeToArray = function (compNames) {
        if (typeof compNames === 'string') {
            return [compNames];
        }
        if (!compNames) {
            return [];
        }
        if (compNames instanceof Array) {
            return compNames;
        }
    };
    Entity.prototype.hasComponents = function (compNames) {
        var _this = this;
        this.normalizeToArray(compNames);
        if (!compNames) {
            return false;
        }
        // quick breakout if single
        if (typeof compNames === 'string') {
            if (this.components[compNames]) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return compNames.reduce(function (agg, compName) {
                return agg && !!_this.components[compName];
            }, true);
        }
    };
    Entity.counter = 0;
    Entity.entities = {};
    return Entity;
}());
window.Entity = Entity;

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
        if (type === 'circle' && isPosInsideCircle(x, y, shapeX, shapeY, radius)) {
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
        else ;
    });
    return hits;
}

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
        shapeMetaData.radius;
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
        else ;
    });
    return hits;
}

var Shapes = /** @class */ (function () {
    function Shapes(draw, metaData) {
        if (metaData === void 0) { metaData = {}; }
        this.draw = draw;
        this.metaData = metaData;
    }
    return Shapes;
}());
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

/**
 * Library for working with Canvas,
 * Works by using a 2D context as an argument
 * Provides abstraction for some common shapes in Canvas
 */
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
        shapes.set(id, new Shapes(function () {
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
        var id = _a.id, drawFn = _a.drawFn, _b = _a.layerName, layerName = _b === void 0 ? 'initial' : _b;
        var layer = this.layers[layerName];
        var ctx = layer.ctx;
        var shapes = layer.shapes;
        shapes.set(id, new Shapes(function () {
            drawFn(ctx);
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
        shapes.set(id, new Shapes(function () {
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
        shapes.set(id, new Shapes(function () {
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
        shapes.set(id, new Shapes(function () {
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
if (process.env.NODE_ENV === 'test') {
    CanvasAPI.prototype.addImage = function () {
    };
}

var GameCanvas = /** @class */ (function () {
    function GameCanvas(options) {
        var _this = this;
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
        this.selectedBox = new SelectedBox();
        [
            'updateViewMapCursorPosition',
            'updateMiniMapCursorPosition',
            'handleMapMouseUp',
            'handleMapMouseDown',
            'handleMapMouseDown',
            'handleMiniMapClick',
            'handleMiniMapMove',
            'handleMapMouseMove',
            'handleMapMouseLeave',
            'handleTouchMove',
            'handleTouchStart',
            'handleMapTouchEnd',
            'handleMiniMapTouchStart'
        ].forEach(function (fn) {
            _this[fn] = _this[fn].bind(_this);
        });
    }
    /**
     * @desc - Gets the x,y position inside the canvas based on a mouse event with clientX and clientY
     *         Will return X,Y values in relative terms to the painted Canvas dimensions and includes panning
     * @param clientInputCoordinates
     * @param canvas
     * @param canvasAPI
     */
    GameCanvas.prototype.getCursorPositionInCanvasTerms = function (clientInputCoordinates, canvas, canvasAPI) {
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
        var x = scaledX - canvasAPI.getPan().panX;
        var y = scaledY - canvasAPI.getPan().panY;
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
                hits = __spread(hits, getShapesFromClick(_this.mapAPI.layers[layerName].shapes, layerName, x, y));
            }
            else {
                hits = __spread(hits, getShapesInSelectionBox(_this.mapAPI.layers[layerName].shapes, layerName, selectedData));
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
        this.selectedBox.setStart(this.lastKnownPositionInCanvasTermsX, this.lastKnownPositionInCanvasTermsY);
        this.selectedBox.setEnd(this.lastKnownPositionInCanvasTermsX, this.lastKnownPositionInCanvasTermsY);
    };
    GameCanvas.prototype.handleTouchStart = function (e) {
        var coords = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        this.updateViewMapCursorPosition(coords);
        var _a = this.getCursorPositionInCanvasTerms(coords, this.viewMapCanvas, this.mapAPI); _a.x; _a.y;
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
        var _b = this.mapAPI.getPan(), currentPanX = _b.panX, currentPanY = _b.panY;
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
        this.mapAPI.pan(this.ensureNegative(newPanX), this.ensureNegative(newPanY));
    };
    GameCanvas.prototype.generateMapCanvas = function (getRef) {
        var _this = this;
        return (React__namespace.createElement("canvas", { className: 'viewMap', ref: function (el) {
                if (!el) {
                    return null;
                }
                if (process.env.NODE_ENV === 'test' && !el.removeEventListener) {
                    // @ts-ignore
                    el = el._reactInternalFiber.child.stateNode; // eslint-disable-line
                }
                _this.viewMapCanvas = el;
                document.removeEventListener('mousemove', _this.updateViewMapCursorPosition);
                document.addEventListener('mousemove', _this.updateViewMapCursorPosition);
                el.removeEventListener('touchmove', _this.handleTouchMove, false);
                el.addEventListener('touchmove', _this.handleTouchMove, false);
                _this.mapAPI = new CanvasAPI(el.getContext('2d'));
                getRef(_this.mapAPI, el);
            }, height: this.viewHeight, width: this.viewWidth, onMouseDown: this.handleMapMouseDown, onTouchStart: this.handleTouchStart, onTouchEnd: this.handleMapTouchEnd, onMouseMove: this.handleMapMouseMove, onMouseUp: this.handleMapMouseUp, onMouseLeave: this.handleMapMouseLeave }));
    };
    GameCanvas.prototype.generateMiniMapCanvas = function (getRef) {
        var _this = this;
        return (React__namespace.createElement("canvas", { className: 'minimap', ref: function (el) {
                if (!el) {
                    return null;
                }
                if (process.env.NODE_ENV === 'test' && !el.removeEventListener) {
                    el = el._reactInternalFiber.child.stateNode; // eslint-disable-line
                }
                _this.miniMapCanvas = el;
                document.removeEventListener('mousemove', _this.updateMiniMapCursorPosition);
                document.addEventListener('mousemove', _this.updateMiniMapCursorPosition);
                _this.miniMapAPI = new CanvasAPI(el.getContext('2d'));
                // updateMiniMapSquare depends on mapAPI to be defined
                // due to some race conditions this might happen before mapAPI was defined
                // An interval is used to detect when mapAPI is defined
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

exports.Engine = Engine;
exports.Entity = Entity;
exports.GameCanvas = GameCanvas;
exports.ObjectPool = ObjectPool;
exports.entityLoop = entityLoop;
