import Group from './Group';
import entityLoop from './util/entityLoop';

let spliceOne = function(arr, index) {
  let idx = index;
  let len = arr.length;
  if (!len) {
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


class Entity {
  constructor(classRef) {
    Entity.counter++;
    this.id = Entity.counter;
    this.constructor = classRef;
    this.components = {};
    Entity.entities[this.id] = this;
  }

  assignGroup(group) {
    group.entities[this.id] = this;
  }

  // A component is added
  // we create a new group index, for exm
  addComponent(component) {
    this.components[component.name] = component;
    this[component.name] = component;
    // creates an index group if it does not exist..

    let arr = [];
    for (let compName in this.components) {
      arr.push(compName);
    }
    Group.indexGroup(arr, Entity.entities);

    // we need to see if we need to add entity into other groups.
    for (let groupKey in Group.groups) {
      let group = Group.groups[groupKey];
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
        let newGroup = this.copyArray(group);
        group.array = this.extendGroup(newGroup);
      }
    }
  }

  // that's not really copying the array now is it?
  copyArray(group) {
    return group.array;
  }

  extendGroup(newGroup) {
    newGroup[newGroup.length] = this;
    return newGroup;
  }

  // mixed, an actual component or just component name
  removeComponent(comp) {
    let component = this.components[comp] || comp;
    let compName = component.name;

    // we need to see if we need to remove entity from other groups
    for (let groupKey in Group.groups) {
      let group = Group.groups[groupKey];
      // if the ent is in this group, skip.

      let compInGroup = group.components.indexOf(component.name) > -1;
      let entHasReqComps = this.hasComponents(group.components);

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
  destroy() {
    Object.keys(this.components).forEach((compName) => {
      this.removeComponent(this.components[compName]);
    });
    delete Entity.entities[this.id];
  }

  hasComponents(components = []) {
    // quick breakout
    if (this.components[components]) {
      return true;
    }

    let compNames = components.reduce ? components : [components];

    return compNames.reduce((agg, compName) => {
      return agg && !!this.components[compName];
    }, true);
  }
}

Entity.entities = {};

/**
 * @param components
 * @param type 'array'|'map'
 * @return return array/map
 */
Entity.getByComps = (components, type = 'array') => {
  let compNames = components.reduce ? components : [components];
  Group.indexGroup(components, Entity.entities);
  let group = Group.getGroup(compNames);
  return type === 'map' ? group.entities : group.array.concat();
};

Entity.reset = () => {
  entityLoop(Entity.entities, (entity) => {
    entity.destroy();
  });
  Group.reset();
};

Entity.counter = 0;

window.Entity = Entity;
export default Entity;