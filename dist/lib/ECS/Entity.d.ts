import Group from './Group';
import { IComponent, IEntityMap } from "../interfaces";
declare class Entity {
    static counter: number;
    static entities: IEntityMap<Entity>;
    id: number;
    components: {
        [key: string]: IComponent;
    };
    constructor(classRef: unknown);
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
    removeComponent(comp: string | IComponent): void;
    /**
     * Destroying an entity means removing all its components and deleting it from the Entity Object
     */
    destroy(): void;
    normalizeToArray(compNames: any): any[];
    hasComponents(compNames?: Array<string> | string): boolean;
}
export default Entity;
