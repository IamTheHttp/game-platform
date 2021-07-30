import { IComponent, IEntityMap } from "../interfaces";
declare class Group {
    components: IComponent[];
    entities: IEntityMap;
    array: any[];
    static groups: {};
    constructor(components: IComponent[], entities?: IEntityMap, array?: any[]);
    static reset(): void;
    static generateGroupKey(compNames: Array<string>): string;
    static getGroup(compNames: Array<string>): Group;
    static indexGroup(compNames: Array<string> | string, entities: IEntityMap): any;
}
export default Group;
