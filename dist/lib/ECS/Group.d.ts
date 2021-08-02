import { IEmptyGroup, IEntityMap } from "../interfaces";
import Entity from "./Entity";
declare class Group {
    components: string[];
    entities: IEntityMap<Entity>;
    array: any[];
    static groups: Record<string, Group>;
    constructor(components: string[], entities?: IEntityMap<Entity>, array?: any[]);
    static reset(): void;
    static generateGroupKey(compNames: Array<string>): string;
    static getGroup(compNames: Array<string>): Group | IEmptyGroup;
    static indexGroup(compNames: Array<string> | string, entities: IEntityMap<Entity>): Group;
}
export default Group;
