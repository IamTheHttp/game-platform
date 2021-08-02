import Group from './Group';
import entityLoop from './util/entityLoop';
import {IComponent, IEntityMap} from "../interfaces";
import spliceOne from './util/spliceOne';



class Entity {
  static counter: number = 0;
  static entities: IEntityMap<Entity> = {}; // TODO can this be improved?
  id: number;


  components: {
    [key: string]: IComponent
  };

  constructor(classRef: unknown) {
    this.id = Entity.counter;
    // @ts-ignore TODO can this be improved?
    this.constructor = classRef;
    this.components = {};
    Entity.entities[this.id] = this;
    Entity.counter++;
  }

  static reset() {
    entityLoop(Entity.entities, (entity) => {
      entity.destroy();
    });
    Group.reset();
  };

  // static if(value: any, condition: boolean): void;
  static getByComps<T>(components: Array<string>): Array<T>;
  static getByComps<T>(components: Array<string>, type: 'map'): IEntityMap<T>;
  static getByComps<T>(components: Array<string>, type: 'array'): Array<T>;
  static getByComps<T>(components: Array<string>, type = 'array'): IEntityMap<Entity> | Array<Entity> {
    let compNames = components;
    Group.indexGroup(components, Entity.entities);
    let group = Group.getGroup(compNames);
    return type === 'map' ? group.entities : group.array.concat();
  };

  static getByComp<T>(compName: string): Array<T>;
  static getByComp<T>(compName: string, type: 'map'): IEntityMap<T>;
  static getByComp<T>(compName: string, type: 'array'): Array<T>;
  static getByComp<T>(compName: string, type= 'array'): IEntityMap<T>|Array<T> {
    return Entity.getByComps<T>([compName]);
  };

  assignGroup(group: Group) {
    group.entities[this.id] = this;
  }

  // A component is added
  // we create a new group index, for exm
  addComponent(component: IComponent) {
    this.components[component.name] = component;
    // @ts-ignore TODO can this be improved?
    this[component.name] = component;
    // creates an index group if it does not exist..

    let arr = [];
    for (let compName in this.components) {
      if (this.components.hasOwnProperty(compName)) {
        arr.push(compName);
      }
    }
    Group.indexGroup(arr, Entity.entities);

    // we need to see if we need to add entity into other groups.
    for (let groupKey in Group.groups) {
      if (!Group.groups.hasOwnProperty(groupKey)) {
        continue;
      }
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
  copyArray(group: Group) {
    return group.array;
  }

  extendGroup(newGroup: unknown[]) {
    newGroup[newGroup.length] = this;
    return newGroup;
  }

  // mixed, an actual component or just component name
  removeComponent(comp: string | IComponent) {
    let component = this.components[comp as string] || comp;
    if (!component || typeof component === 'string') {
      return;
    }
    let compName = component.name;

    // we need to see if we need to remove entity from other groups
    for (let groupKey in Group.groups) {
      if (!Group.groups.hasOwnProperty(groupKey)) {
        continue;
      }
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
    // @ts-ignore, TODO can we provide types for component properties on the Entity? Entity['MY_COMP']
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

  public normalizeToArray(compNames: any): any[] {
    if (typeof compNames === 'string') {
      return [compNames];
    }

    if (!compNames) {
      return [];
    }

    if (compNames instanceof Array) {
      return compNames;
    }
  }

  hasComponents(compNames?: Array<string> | string) {
    let componentNames = this.normalizeToArray(compNames);

    if (!compNames) {
      return false;
    }
    // quick breakout if single
    if (typeof compNames === 'string') {
      if (this.components[compNames]) {
        return true;
      } else {
        return false;
      }
    } else {
      return compNames.reduce((agg, compName) => {
        return agg && !!this.components[compName];
      }, true);
    }
  }
}

window.Entity = Entity;
export default Entity;