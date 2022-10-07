"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Group_1 = __importDefault(require("./Group"));
var entityLoop_1 = __importDefault(require("./util/entityLoop"));
var spliceOne_1 = __importDefault(require("./util/spliceOne"));
var Entity = /** @class */ (function () {
    function Entity() {
        this.id = Entity.counter;
        this.components = {};
        Entity.entities[this.id] = this;
        Entity.counter++;
    }
    Entity.reset = function () {
        (0, entityLoop_1.default)(Entity.entities, function (entity) {
            entity.destroy();
        });
        Group_1.default.reset();
    };
    ;
    Entity.getByComps = function (components, type) {
        if (type === void 0) { type = 'array'; }
        var compNames = components;
        Group_1.default.indexGroup(components, Entity.entities);
        var group = Group_1.default.getGroup(compNames);
        return type === 'map' ? group.entities : group.array.concat();
    };
    ;
    Entity.getByComp = function (compName, type) {
        if (type === void 0) { type = 'array'; }
        return Entity.getByComps([compName]);
    };
    ;
    Entity.prototype.assignGroup = function (group) {
        group.entities[this.id] = this;
    };
    // A component is added
    // we create a new group index, for exm
    Entity.prototype.addComponent = function (component) {
        this.components[component.name] = component;
        // @ts-ignore TODO can this be improved?
        this[component.name] = component;
        // creates an index group if it does not exist..
        var arr = [];
        for (var compName in this.components) {
            if (this.components.hasOwnProperty(compName)) {
                arr.push(compName);
            }
        }
        Group_1.default.indexGroup(arr, Entity.entities);
        // we need to see if we need to add entity into other groups.
        for (var groupKey in Group_1.default.groups) {
            if (!Group_1.default.groups.hasOwnProperty(groupKey)) {
                continue;
            }
            var group = Group_1.default.groups[groupKey];
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
        if (!component || typeof component === 'string') {
            return;
        }
        var compName = component.name;
        // we need to see if we need to remove entity from other groups
        for (var groupKey in Group_1.default.groups) {
            if (!Group_1.default.groups.hasOwnProperty(groupKey)) {
                continue;
            }
            var group = Group_1.default.groups[groupKey];
            // if the ent is in this group, skip.
            var compInGroup = group.components.indexOf(component.name) > -1;
            var entHasReqComps = this.hasComponents(group.components);
            // if this ent does not have all the other comps, skip..
            if (group.entities[this.id] && compInGroup && entHasReqComps) {
                delete group.entities[this.id];
                (0, spliceOne_1.default)(group.array, group.array.indexOf(this));
            }
        }
        delete this.components[compName];
        // @ts-ignore, TODO can we provide types for component properties on the Entity? Entity['MY_COMP']
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
        var componentNames = this.normalizeToArray(compNames);
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
    Entity.entities = {}; // TODO can this be improved?
    return Entity;
}());
window.Entity = Entity;
exports.default = Entity;
