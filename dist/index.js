"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = exports.GameCanvas = exports.ObjectPool = exports.entityLoop = exports.Entity = void 0;
var Entity_1 = __importDefault(require("./lib/ECS/Entity"));
exports.Entity = Entity_1.default;
var entityLoop_1 = __importDefault(require("./lib/ECS/util/entityLoop"));
exports.entityLoop = entityLoop_1.default;
var ObjectPool_1 = __importDefault(require("./lib/ObjectPool/ObjectPool"));
exports.ObjectPool = ObjectPool_1.default;
var GameCanvas_1 = __importDefault(require("./lib/GameCanvas/GameCanvas"));
exports.GameCanvas = GameCanvas_1.default;
var Engine_1 = __importDefault(require("./lib/Engine/Engine"));
exports.Engine = Engine_1.default;
