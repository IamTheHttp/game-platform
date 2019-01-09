(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("react")) : factory(root["react"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_10__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * used to loop over and possibly filter entities
 * Accepts either a map of Entities with EntitiyID as Key, or an array
 * if the CB returns true, an array of entities that return true is returned.
 * @param entities
 * @param fn
 * @returns {Array}
 */
exports.default = function (entities, fn) {
  var ents = [];

  if (entities.forEach) {
    entities.forEach(function (ent) {
      fn(ent) && ents.push(ent);
    });
  } else {
    Object.keys(entities).forEach(function (entID) {
      fn(entities[entID]) && ents.push(entities[entID]);
    });
  }

  return ents;
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spliceOne = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Group = __webpack_require__(5);

var _Group2 = _interopRequireDefault(_Group);

var _entityLoop = __webpack_require__(0);

var _entityLoop2 = _interopRequireDefault(_entityLoop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var spliceOne = exports.spliceOne = function spliceOne(arr) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

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

var Entity = function () {
  function Entity(classRef) {
    _classCallCheck(this, Entity);

    Entity.counter++;
    this.id = Entity.counter;
    this.constructor = classRef;
    this.components = {};
    Entity.entities[this.id] = this;
  }

  _createClass(Entity, [{
    key: 'assignGroup',
    value: function assignGroup(group) {
      group.entities[this.id] = this;
    }

    // A component is added
    // we create a new group index, for exm

  }, {
    key: 'addComponent',
    value: function addComponent(component) {
      this.components[component.name] = component;
      this[component.name] = component;
      // creates an index group if it does not exist..

      var arr = [];
      for (var compName in this.components) {
        arr.push(compName);
      }
      _Group2.default.indexGroup(arr, Entity.entities);

      // we need to see if we need to add entity into other groups.
      for (var groupKey in _Group2.default.groups) {
        var group = _Group2.default.groups[groupKey];
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
    }

    // that's not really copying the array now is it?

  }, {
    key: 'copyArray',
    value: function copyArray(group) {
      return group.array;
    }
  }, {
    key: 'extendGroup',
    value: function extendGroup(newGroup) {
      newGroup[newGroup.length] = this;
      return newGroup;
    }

    // mixed, an actual component or just component name

  }, {
    key: 'removeComponent',
    value: function removeComponent(comp) {
      var component = this.components[comp] || comp;
      var compName = component.name;

      // we need to see if we need to remove entity from other groups
      for (var groupKey in _Group2.default.groups) {
        var group = _Group2.default.groups[groupKey];
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
    }

    /**
     * Destroying an entity means removing all its components and deleting it from the Entity Object
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      var _this = this;

      Object.keys(this.components).forEach(function (compName) {
        _this.removeComponent(_this.components[compName]);
      });
      delete Entity.entities[this.id];
    }
  }, {
    key: 'hasComponents',
    value: function hasComponents() {
      var _this2 = this;

      var components = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      // quick breakout
      if (this.components[components]) {
        return true;
      }

      var compNames = components.reduce ? components : [components];

      return compNames.reduce(function (agg, compName) {
        return agg && !!_this2.components[compName];
      }, true);
    }
  }]);

  return Entity;
}();

Entity.entities = {};

/**
 * @param components
 * @param type 'array'|'map'
 * @return return array/map
 */
Entity.getByComps = function (components) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'array';

  var compNames = components.reduce ? components : [components];
  _Group2.default.indexGroup(components, Entity.entities);
  var group = _Group2.default.getGroup(compNames);
  return type === 'map' ? group.entities : group.array.concat();
};

Entity.reset = function () {
  (0, _entityLoop2.default)(Entity.entities, function (entity) {
    entity.destroy();
  });
  _Group2.default.reset();
};

Entity.counter = 0;

window.Entity = Entity;
exports.default = Entity;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(10);

var _react2 = _interopRequireDefault(_react);

var _CanvasAPI = __webpack_require__(4);

var _CanvasAPI2 = _interopRequireDefault(_CanvasAPI);

var _SelectedBox = __webpack_require__(6);

var _SelectedBox2 = _interopRequireDefault(_SelectedBox);

var _getShapesFromClick = __webpack_require__(7);

var _getShapesFromClick2 = _interopRequireDefault(_getShapesFromClick);

var _getShapesInSelectionBox = __webpack_require__(8);

var _getShapesInSelectionBox2 = _interopRequireDefault(_getShapesInSelectionBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameCanvas = function () {
  function GameCanvas(options) {
    _classCallCheck(this, GameCanvas);

    this.selectedBoxColor = options.selectedBoxColor || 'blue';
    this.mapHeight = options.mapHeight;
    this.mapWidth = options.mapWidth;
    this.viewHeight = options.viewHeight;
    this.viewWidth = options.viewWidth;
    this.onViewMapClick = options.onViewMapClick;
    this.onViewMapMove = options.onViewMapMove;
    this.lastClick = 0;
    this.dbClick = false;
    this.lastTap = 0;
    this.lastClick = false;
    this.selectedBox = new _SelectedBox2.default();
    this.updateViewMapCursorPosition = this.updateViewMapCursorPosition.bind(this);
    this.updateMiniMapCursorPosition = this.updateMiniMapCursorPosition.bind(this);
    this.handleMapMouseUp = this.handleMapMouseUp.bind(this);
    this.handleMapMouseDown = this.handleMapMouseDown.bind(this);
    this.handleMiniMapClick = this.handleMiniMapClick.bind(this);
    this.handleMapMouseMove = this.handleMapMouseMove.bind(this);
    this.handleMapMouseLeave = this.handleMapMouseLeave.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleMapTouchEnd = this.handleMapTouchEnd.bind(this);
    this.handleMiniMapTouchStart = this.handleMiniMapTouchStart.bind(this);
  }

  _createClass(GameCanvas, [{
    key: 'updateCursorPosition',
    value: function updateCursorPosition(event, canvas, canvasAPI) {
      var rect = canvas.getBoundingClientRect();
      // base position
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;

      x = Math.max(0, Math.round(x * (canvas.width / rect.width))) - canvasAPI.getPan().panX;
      y = Math.max(0, Math.round(y * (canvas.height / rect.height))) - canvasAPI.getPan().panY;

      return { x: x, y: y };
    }
  }, {
    key: 'handleMapMouseMove',
    value: function handleMapMouseMove() {
      if (this.isMouseDown) {
        this.selectedBox.setEnd(this.viewMapX, this.viewMapY);

        var data = this.selectedBox.getData();

        this.mapAPI.addRect({
          id: 'selectedBox',
          x: data.start.x,
          y: data.start.y,
          width: data.width,
          height: data.height,
          strokeStyle: this.selectedBoxColor
        });
      }

      this.onViewMapMove({
        x: this.viewMapX,
        y: this.viewMapY,
        isMouseDown: this.isMouseDown,
        dbClick: this.dbClick,
        selectedBox: this.selectedBox.getData()
      });
    }
  }, {
    key: 'handleMapMouseLeave',
    value: function handleMapMouseLeave() {
      if (this.isMouseDown) {
        this.handleMapMouseUp();
      }
    }
  }, {
    key: 'handleMapTouchEnd',
    value: function handleMapTouchEnd() {
      this.isMouseDown = false;

      var selectedData = this.selectedBox.getData();

      var hits = [];
      // if a single click...
      if (selectedData.end.x === selectedData.start.x) {
        var x = selectedData.end.x;
        var y = selectedData.end.y;
        hits = (0, _getShapesFromClick2.default)(this.mapAPI.shapes, x, y);
      } else {
        hits = (0, _getShapesInSelectionBox2.default)(this.mapAPI.shapes, selectedData);
      }

      this.mapAPI.addRect({
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
    }
  }, {
    key: 'handleMapMouseUp',
    value: function handleMapMouseUp() {
      if (!this.lastTap) {
        this.handleMapTouchEnd();
      }
    }
  }, {
    key: 'updateViewMapCursorPosition',
    value: function updateViewMapCursorPosition(event) {
      var _updateCursorPosition = this.updateCursorPosition(event, this.viewMapCanvas, this.mapAPI),
          x = _updateCursorPosition.x,
          y = _updateCursorPosition.y;

      this.viewMapX = x;
      this.viewMapY = y;
    }
  }, {
    key: 'updateMiniMapCursorPosition',
    value: function updateMiniMapCursorPosition(event) {
      var _updateCursorPosition2 = this.updateCursorPosition(event, this.miniMapCanvas, this.miniMapAPI),
          x = _updateCursorPosition2.x,
          y = _updateCursorPosition2.y;

      this.miniMapX = x;
      this.miniMapY = y;
    }
  }, {
    key: 'getNewCanvasPairs',
    value: function getNewCanvasPairs(_ref) {
      var getMapRef = _ref.getMapRef,
          getMiniRef = _ref.getMiniRef;

      return {
        map: this.generateMapCanvas(getMapRef),
        minimap: this.generateMiniMapCanvas(getMiniRef)
      };
    }
  }, {
    key: 'handleMiniMapClick',
    value: function handleMiniMapClick() {
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
    }
  }, {
    key: 'updateMiniMapSquare',
    value: function updateMiniMapSquare() {
      this.miniMapAPI.addRect({
        id: 'currentMap',
        x: -this.mapAPI.getPan().panX,
        y: -this.mapAPI.getPan().panY,
        width: this.viewWidth,
        height: this.viewHeight,
        strokeStyle: 'green',
        lineWidth: 20
      });
    }
  }, {
    key: 'handleMapMouseDown',
    value: function handleMapMouseDown() {
      if (!this.lastTap) {
        var now = new Date().getTime();
        this.dbClick = now - this.lastClick < 300;
        this.lastClick = now;
        this.isMouseDown = true;
        this.setSelectBox();
      }
    }
  }, {
    key: 'setSelectBox',
    value: function setSelectBox() {
      this.selectedBox.setStart(this.viewMapX, this.viewMapY);
      this.selectedBox.setEnd(this.viewMapX, this.viewMapY);
    }
  }, {
    key: 'handleTouchStart',
    value: function handleTouchStart(e) {
      var _updateCursorPosition3 = this.updateCursorPosition(e.touches[0], this.viewMapCanvas, this.mapAPI),
          x = _updateCursorPosition3.x,
          y = _updateCursorPosition3.y;

      var now = new Date().getTime();

      this.dbTap = now - this.lastTap < 300;
      this.lastTap = now;

      this.viewMapX = x;
      this.viewMapY = y;

      this.setSelectBox();
    }
  }, {
    key: 'handleMiniMapTouchStart',
    value: function handleMiniMapTouchStart(e) {
      var _updateCursorPosition4 = this.updateCursorPosition(e.touches[0], this.miniMapCanvas, this.miniMapAPI),
          x = _updateCursorPosition4.x,
          y = _updateCursorPosition4.y;

      this.miniMapX = x;
      this.miniMapY = y;

      this.handleMiniMapClick();
    }
  }, {
    key: 'handleTouchMove',
    value: function handleTouchMove(e) {
      e.preventDefault();

      var _updateCursorPosition5 = this.updateCursorPosition(e.touches[0], this.viewMapCanvas, this.mapAPI),
          x = _updateCursorPosition5.x,
          y = _updateCursorPosition5.y;

      var calcPanX = void 0;
      var calcPanY = void 0;

      var _mapAPI$getPan = this.mapAPI.getPan(),
          panX = _mapAPI$getPan.panX,
          panY = _mapAPI$getPan.panY;

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
    }
  }, {
    key: 'generateMapCanvas',
    value: function generateMapCanvas(getRef) {
      var _this = this;

      return _react2.default.createElement('canvas', {
        className: 'viewMap',
        ref: function ref(el) {
          if (!el) {
            return null;
          }
          _this.viewMapCanvas = el;
          document.removeEventListener('mousemove', _this.updateViewMapCursorPosition);
          document.addEventListener('mousemove', _this.updateViewMapCursorPosition);
          el.removeEventListener('touchmove', _this.handleTouchMove, false);
          el.addEventListener('touchmove', _this.handleTouchMove, false);

          _this.mapAPI = new _CanvasAPI2.default(el.getContext('2d'));
          getRef(_this.mapAPI, el);
        },
        height: this.viewHeight,
        width: this.viewWidth,
        onMouseDown: this.handleMapMouseDown,
        onTouchStart: this.handleTouchStart,
        onTouchEnd: this.handleMapTouchEnd,
        onMouseMove: this.handleMapMouseMove,
        onMouseUp: this.handleMapMouseUp,
        onMouseLeave: this.handleMapMouseLeave
      });
    }
  }, {
    key: 'generateMiniMapCanvas',
    value: function generateMiniMapCanvas(getRef) {
      var _this2 = this;

      return _react2.default.createElement('canvas', {
        className: 'minimap',
        ref: function ref(el) {
          if (!el) {
            return null;
          }
          _this2.miniMapCanvas = el;
          document.removeEventListener('mousemove', _this2.updateMiniMapCursorPosition);
          document.addEventListener('mousemove', _this2.updateMiniMapCursorPosition);

          _this2.miniMapAPI = new _CanvasAPI2.default(el.getContext('2d'));
          // inits the minimap square
          // so this assumes that there's ALREADy a mapAPI
          // bad assumption....

          var key = setInterval(function () {
            if (_this2.mapAPI) {
              _this2.updateMiniMapSquare();
              clearInterval(key);
            }
          }, 100);

          getRef(_this2.miniMapAPI, el);
        },
        height: this.mapHeight,
        width: this.mapWidth,
        onMouseDown: this.handleMiniMapClick,
        onTouchStart: this.handleMiniMapTouchStart
      });
    }
  }]);

  return GameCanvas;
}();

exports.default = GameCanvas;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ObjectPool = function () {
  function ObjectPool(PooledClass) {
    var incrementWhenEmpty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

    _classCallCheck(this, ObjectPool);

    this.type = PooledClass;
    this.freePool = [];
    this.stats = {
      free: 0,
      used: 0
    };
    this.incrementWhenEmpty = incrementWhenEmpty;
  }

  _createClass(ObjectPool, [{
    key: "reset",
    value: function reset() {
      this.freePool = [];
      this.stats = {
        free: 0,
        used: 0
      };
    }

    // Ensures the pool has at least $amount of free objects

  }, {
    key: "generate",
    value: function generate(amount) {
      var count = amount - this.stats.free > 0 ? amount - this.stats.free : 0;
      // generate a gazzilion fighters?
      while (count > 0) {
        this.freePool.push(new this.type());
        count--;
      }
      this.stats.free = this.freePool.length;
    }

    // acquires an object, marks it as 'used'.

  }, {
    key: "acquire",
    value: function acquire() {
      if (this.freePool.length === 0) {
        this.generate(this.incrementWhenEmpty);
      }
      var obj = this.freePool.pop();
      this.stats.free = this.freePool.length;
      return obj;
    }

    // releases an object, marks it as free

  }, {
    key: "release",
    value: function release(object) {
      // prevent release twice
      if (this.freePool.indexOf(object) === -1) {
        this.freePool.push(object);
        this.stats.free = this.freePool.length;
      }
    }
  }]);

  return ObjectPool;
}();

exports.default = ObjectPool;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Library for working with Canvas,
 * Works by using a 2D context as an argument
 * Provides abstraction for some common shapes in Canvas
 */

var Shape = exports.Shape = function Shape(draw, metaData) {
  _classCallCheck(this, Shape);

  this.draw = draw;
  this.metaData = metaData;
};

var CanvasAPI = function () {
  function CanvasAPI(ctx) {
    var strokeStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'white';

    _classCallCheck(this, CanvasAPI);

    this.ctx = ctx;
    this.defaultStrokeStyle = strokeStyle;
    ctx.strokeStyle = strokeStyle;
    this.shapes = new Map();
  }

  /**
   * Clears all the shapes
   */


  _createClass(CanvasAPI, [{
    key: 'clear',
    value: function clear() {
      this.shapes = new Map();
    }

    /**
     * Removes a shape by its ID
     * @param id
     */

  }, {
    key: 'remove',
    value: function remove(id) {
      this.shapes.delete(id);
    }

    /* istanbul ignore next */

  }, {
    key: 'addImage',
    value: function addImage(_ref) {
      var id = _ref.id,
          image = _ref.image,
          x = _ref.x,
          y = _ref.y,
          height = _ref.height,
          width = _ref.width,
          cropStartX = _ref.cropStartX,
          cropStartY = _ref.cropStartY,
          cropSizeX = _ref.cropSizeX,
          cropSizeY = _ref.cropSizeY,
          rotation = _ref.rotation;

      var ctx = this.ctx;
      this.shapes.set(id, new Shape(function () {
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
    }
  }, {
    key: 'addRect',
    value: function addRect(_ref2) {
      var id = _ref2.id,
          x = _ref2.x,
          y = _ref2.y,
          width = _ref2.width,
          height = _ref2.height,
          strokeStyle = _ref2.strokeStyle,
          lineWidth = _ref2.lineWidth;

      var ctx = this.ctx;
      this.shapes.set(id, new Shape(function () {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.rect(x, y, width, height);
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
    }
  }, {
    key: 'addCircle',
    value: function addCircle(_ref3) {
      var id = _ref3.id,
          x = _ref3.x,
          y = _ref3.y,
          radius = _ref3.radius,
          strokeStyle = _ref3.strokeStyle,
          lineWidth = _ref3.lineWidth,
          fillColor = _ref3.fillColor;

      var ctx = this.ctx;
      this.shapes.set(id, new Shape(function () {
        ctx.strokeStyle = strokeStyle;
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
    }

    /**
     * Method allows us to pan around the canvas
     */

  }, {
    key: 'pan',
    value: function pan(x, y) {
      this.panX = x;
      this.panY = y;
      this.ctx.setTransform(1, 0, 0, 1, x, y);
    }
  }, {
    key: 'getPan',
    value: function getPan() {
      return {
        panX: this.panX || 0,
        panY: this.panY || 0
      };
    }
  }, {
    key: 'write',
    value: function write(_ref4) {
      var _this = this;

      var id = _ref4.id,
          text = _ref4.text,
          x = _ref4.x,
          y = _ref4.y,
          font = _ref4.font,
          textBaseline = _ref4.textBaseline,
          fillStyle = _ref4.fillStyle;

      this.shapes.set(id, new Shape(function () {
        _this.ctx.beginPath();
        _this.ctx.font = font;
        _this.ctx.textBaseline = textBaseline;
        _this.ctx.fillStyle = fillStyle;
        _this.ctx.fillText(text, x, y);
        _this.ctx.closePath();
      }, {
        id: id,
        x: x,
        y: y
      }));
    }
  }, {
    key: 'draw',
    value: function draw() {
      this.ctx.save();
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.restore();

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.shapes.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var shape = _step.value;

          shape.draw();
          this.ctx.strokeStyle = this.defaultStrokeStyle;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);

  return CanvasAPI;
}();

// adding an image causes segmentation fault for some reason :)
/* istanbul ignore next */


if (false) {
  CanvasAPI.prototype.addImage = function () {};
}
exports.default = CanvasAPI;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _entityLoop = __webpack_require__(0);

var _entityLoop2 = _interopRequireDefault(_entityLoop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Group = function Group(components) {
  var entities = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  _classCallCheck(this, Group);

  this.components = components;
  this.entities = entities;
  this.array = [];
};

Group.groups = {};

Group.reset = function () {
  Group.groups = {};
};

Group.generateGroupKey = function (components) {
  var names = [];
  for (var count = 0; count < components.length; count++) {
    var name = components[count];
    names.push(name);
  }

  return names.map(function (x) {
    return x.toLowerCase();
  }).sort().join('-');
};

Group.getGroup = function (components) {
  var key = Group.generateGroupKey(components);
  return Group.groups[key] || {};
};

// this will create a new index group for the provided components.
Group.indexGroup = function (components, entities) {
  var compArray = components.reduce ? components : [components];

  var key = Group.generateGroupKey(compArray);

  var group = void 0;

  if (Group.groups[key]) {
    return;
  } else {
    group = Group.groups[key] = new Group(compArray);
  }

  // insert the provided entities into this group...
  (0, _entityLoop2.default)(entities, function (entity) {
    if (entity.hasComponents(compArray)) {
      group.entities[entity.id] = entity;
      group.array = [].concat(_toConsumableArray(group.array), [entity]);
    }
  });

  return group;
};

exports.default = Group;

// life cycle of a group!

// 1. Adding a component adds a group with that one component.
// 2. Adding 2nd component creates a group with that 2nd component
// 3. Querying for a list of components should create an group for that list, one off.
// 4. Adding and removing components will update the above lists as needed.

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class that represents the current selected area by the user
 * Populated when the user click, holds and move the mouse
 */
var SelectedBox = function () {
  function SelectedBox() {
    _classCallCheck(this, SelectedBox);

    this.reset();
  }

  _createClass(SelectedBox, [{
    key: "reset",
    value: function reset() {
      this.start = {
        x: 0,
        y: 0
      };
      this.end = {
        x: 0,
        y: 0
      };
    }
  }, {
    key: "getData",
    value: function getData() {
      return {
        start: Object.assign({}, this.start),
        end: Object.assign({}, this.end),
        width: this.getWidth(),
        height: this.getHeight()
      };
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      return this.end.y - this.start.y;
    }
  }, {
    key: "getWidth",
    value: function getWidth() {
      return this.end.x - this.start.x;
    }
  }, {
    key: "setStart",
    value: function setStart(x, y) {
      this.start.x = x;
      this.start.y = y;
    }
  }, {
    key: "setEnd",
    value: function setEnd(x, y) {
      this.end.x = x;
      this.end.y = y;
    }
  }]);

  return SelectedBox;
}();

exports.default = SelectedBox;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isPosInsideCircle = __webpack_require__(9);

var _isPosInsideCircle2 = _interopRequireDefault(_isPosInsideCircle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Function used for getting all shapes hit from a single click (not from a selection box)
 */
function getShapesFromClick(shapes, x, y) {
  var hits = [];

  shapes.forEach(function (shape, id) {
    var shapeMetaData = shape.metaData;
    var shapeX = shapeMetaData.x;
    var shapeY = shapeMetaData.y;
    var radius = shapeMetaData.radius;
    var type = shapeMetaData.type;

    if (type === 'circle' && (0, _isPosInsideCircle2.default)(x, y, shapeX, shapeY, radius)) {
      hits.push(id);
    } else if (type !== 'circle') {
      // do nothing, no support for non circles
    }
  });

  return hits;
}

exports.default = getShapesFromClick;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
function getShapesInSelectionBox(shapes, selectedData) {
  var minX = Math.min(selectedData.start.x, selectedData.end.x);
  var maxX = Math.max(selectedData.start.x, selectedData.end.x);
  var minY = Math.min(selectedData.start.y, selectedData.end.y);
  var maxY = Math.max(selectedData.start.y, selectedData.end.y);

  var hits = [];
  shapes.forEach(function (shape, id) {
    var shapeMetaData = shape.metaData;
    var shapeX = shapeMetaData.x;
    var shapeY = shapeMetaData.y;
    var type = shapeMetaData.type;

    if (type === 'circle') {
      var centerX = shapeX;
      var centerY = shapeY;
      if (centerX >= minX && centerX <= maxX && centerY >= minY && centerY <= maxY) {
        hits.push(id);
      }
    } else {
      // do nothing, no support for non circles
    }
  });

  return hits;
}

exports.default = getShapesInSelectionBox;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
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
  return Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2) < Math.pow(radius, 2);
}

exports.default = isPosInsideCircle;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_10__;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Entity = __webpack_require__(1);

var _Entity2 = _interopRequireDefault(_Entity);

var _entityLoop = __webpack_require__(0);

var _entityLoop2 = _interopRequireDefault(_entityLoop);

var _ObjectPool = __webpack_require__(3);

var _ObjectPool2 = _interopRequireDefault(_ObjectPool);

var _GameCanvas = __webpack_require__(2);

var _GameCanvas2 = _interopRequireDefault(_GameCanvas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Entity: _Entity2.default,
  entityLoop: _entityLoop2.default,
  ObjectPool: _ObjectPool2.default,
  GameCanvas: _GameCanvas2.default
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map