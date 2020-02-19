import entityLoop from './util/entityLoop';
import Entity from "./Entity";
import {IComponent, IEntityMap} from "../interfaces";

// TODO move all static functions in to the class
class Group {
  components: Array<IComponent>;
  entities: IEntityMap;
  array: Array<any>;
  static groups: object;
  static reset: () => void;
  static generateGroupKey: (components: Array<string>) => string;
  static getGroup: (compNames: Array<string>) => Group;

  constructor(components, entities = {}) {
    this.components = components;
    this.entities = entities;
    this.array = [];
  }

  static indexGroup(compNames: Array<string> | string, entities: IEntityMap) {
    let compArray = [];
    if (typeof compNames === 'string') {
      compArray = [compNames];
    } else {
      compArray = compNames;
    }

    let key = Group.generateGroupKey(compArray);

    let group;

    // if group already exists, return it
    if (Group.groups[key]) {
      return;
    } else {
      group = Group.groups[key] = new Group(compArray);
    }

// insert the provided entities into this group...
    entityLoop(entities, (entity) => {
      if (entity.hasComponents(compArray)) {
        group.entities[entity.id] = entity;
        group.array = [...group.array, entity];
      }
    });

    return group;
  };
}

Group.groups = {};

Group.reset = () => {
  Group.groups = {};
};

Group.generateGroupKey = (components) => {
  let names = [];
  for (let count = 0; count < components.length; count++) {
    let name = components[count];
    names.push(name);
  }

  return names
    .map((x) => {
      return x.toLowerCase();
    })
    .sort()
    .join('-');
};

Group.getGroup = (components) => {
  let key = Group.generateGroupKey(components);
  return Group.groups[key] || {};
};

export default Group;

// life cycle of a group!

// 1. Adding a component adds a group with that one component.
// 2. Adding 2nd component creates a group with that 2nd component
// 3. Querying for a list of components should create an group for that list, one off.
// 4. Adding and removing components will update the above lists as needed.