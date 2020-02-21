import entityLoop from './util/entityLoop';
import {IComponent, IEntityMap} from "../interfaces";

// life cycle of a group!

// 1. Adding a component adds a group with that one component.
// 2. Adding 2nd component creates a group with that 2nd component
// 3. Querying for a list of components should create an group for that list, one off.
// 4. Adding and removing components will update the above lists as needed.

class Group {
  static groups = {};
  constructor( public components: IComponent[], public entities:IEntityMap = {}, public array : any[] = []) {
  }

  static reset() {
    Group.groups = {};
  }
  static generateGroupKey(compNames: Array<string>): string {
    let names = [];
    for (let count = 0; count < compNames.length; count++) {
      let name = compNames[count];
      names.push(name);
    }

    return names
      .map((x) => {
        return x.toLowerCase();
      })
      .sort()
      .join('-');
  }

  static getGroup(compNames: Array<string>): Group {
    let key = Group.generateGroupKey(compNames);
    return Group.groups[key] || {};
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


export default Group;
