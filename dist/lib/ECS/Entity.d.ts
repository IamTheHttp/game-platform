import Group from './Group';
import { IComponent, IEntityMap } from "../interfaces";
declare class Entity {
    static counter: number;
    static onEntityCreatedCallback: (entity: Entity) => void;
    static onEntityDestroyedCallback: (entity: Entity) => void;
    static onComponentAddedCallback: (entity: Entity, componentName: string) => void;
    static onComponentRemovedCallback: (entity: Entity, componentName: string) => void;
    static entities: IEntityMap<Entity>;
    id: number;
    components: {
        [key: string]: IComponent;
    };
    /**
     * Creates a new Entity
     * onEntityCreatedCallback runs after an entity has been created, but before potential components were assigned
     */
    constructor();
    /**
     * These are for notifications only, no state mutations should happen synchronously on the Entity or components
     * @param fn
     */
    static onComponentAdded(fn: (entity: Entity, component: string) => void): void;
    /**
     * This is for notifications only, no state mutations should happen synchronously on the Entity or components
     * @param fn
     */
    static onComponentRemoved(fn: (entity: Entity, component: string) => void): void;
    /**
     * This is for notifications only, no state mutations should happen synchronously on the Entity or components
     * @param fn
     */
    static onEntityCreated(fn: (entity: Entity) => void): void;
    /**
     * This is for notifications only, no state mutations should happen synchronously on the Entity or components
     * @param fn
     */
    static onEntityDestroyed(fn: (entity: Entity) => void): void;
    static reset(): void;
    static getByComps<T>(components: Array<string>): Array<T>;
    static getByComps<T>(components: Array<string>, type: 'map'): IEntityMap<T>;
    static getByComps<T>(components: Array<string>, type: 'array'): Array<T>;
    static getByComp<T>(compName: string): Array<T>;
    static getByComp<T>(compName: string, type: 'map'): IEntityMap<T>;
    static getByComp<T>(compName: string, type: 'array'): Array<T>;
    assignGroup(group: Group): void;
    addComponent(component: IComponent): void;
    copyArray(group: Group): any[];
    extendGroup(newGroup: unknown[]): unknown[];
    /**
     * Removes a component, accepts either a component name or a component object.
     * Runs the onComponentRemovedCallback before the component is removed
     * @param comp
     */
    removeComponent(comp: string | IComponent): void;
    /**
     * Destroying an entity means removing all its components and deleting it from the Entity Object
     * the onEntityDestroyedCallback runs BEFORE state changes on the Entity
     */
    destroy(): void;
    normalizeToArray(compNames: any): any[];
    hasComponents(compNames?: Array<string> | string): boolean;
}
export default Entity;
