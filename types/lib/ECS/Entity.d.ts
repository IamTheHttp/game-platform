import { IComponent, IEntityMap } from "../interfaces";
export declare let spliceOne: (arr: any, index?: number) => void;
/**
 * Entity class to a static interface
 *
 * entity.addComponent(Component component)
 *
 */
declare class Entity {
    static counter: number;
    static entities: IEntityMap;
    static getByComps: (compNames: Array<string>) => object | Array<any>;
    static reset: () => void;
    id: number;
    components: object;
    constructor(classRef: any);
    assignGroup(group: any): void;
    addComponent(component: IComponent): void;
    copyArray(group: any): any;
    extendGroup(newGroup: any): any;
    removeComponent(comp: any): void;
    /**
     * Destroying an entity means removing all its components and deleting it from the Entity Object
     */
    destroy(): void;
    hasComponents(compNames?: Array<string> | string): boolean;
}
export default Entity;
