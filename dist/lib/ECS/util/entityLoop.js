"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityLoop = void 0;
function entityLoop(entities, fn) {
    var ents = [];
    if (Array.isArray(entities)) {
        entities.forEach(function (ent) {
            fn(ent) && ents.push(ent);
        });
    }
    else {
        Object.keys(entities).forEach(function (entID) {
            fn(entities[+entID]) && ents.push(entities[+entID]);
        });
    }
    return ents;
}
exports.entityLoop = entityLoop;
exports.default = entityLoop;
