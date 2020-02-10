import { IComponent, IEntityMap } from "../interfaces";
declare class Group {
    components: Array<IComponent>;
    entities: IEntityMap;
    array: Array<any>;
    static groups: object;
    static reset: () => void;
    static generateGroupKey: (components: Array<string>) => string;
    static getGroup: (compNames: Array<string>) => Group;
    static indexGroup: (arr: Array<string>, entities: IEntityMap) => void;
    constructor(components: any, entities?: {});
}
export default Group;
