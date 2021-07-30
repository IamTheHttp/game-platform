var __read = (this && this.__read) || function (o, n) {
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import entityLoop from './util/entityLoop';
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
            var name_1 = compNames[count];
            names.push(name_1);
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
    ;
    Group.groups = {};
    return Group;
}());
export default Group;