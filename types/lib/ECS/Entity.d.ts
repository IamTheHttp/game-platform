import { IComponent, IEntityMap } from "../interfaces";
declare class Entity {
    static counter: number;
    static entities: IEntityMap;
    id: number;
    components: {
        [key: string]: IComponent;
    };
    constructor(classRef: any);
    static reset(): void;
    static getByComps(components: Array<string>): Array<Entity>;
    static getByComps(components: Array<string>, type: 'map'): IEntityMap;
    static getByComps(components: Array<string>, type: 'array'): Array<Entity>;
    static getByComp(compName: string): Array<Entity>;
    static getByComp(compName: string, type: 'map'): IEntityMap;
    static getByComp(compName: string, type: 'array'): Array<Entity>;
    assignGroup(group: any): void;
    addComponent(component: IComponent): void;
    copyArray(group: any): any;
    extendGroup(newGroup: any): any;
    removeComponent(comp: any): void;
    /**
     * Destroying an entity means removing all its components and deleting it from the Entity Object
     */
    destroy(): void;
    normalizeToArray(compNames: any): any[];
    hasComponents(compNames?: Array<string> | string): boolean;
}
export default Entity;
