/**
 * used to loop over and possibly filter entities
 * Accepts either a map of Entities with EntityID as Key, or an array
 * if the CB returns true, an array of entities that return true is returned.
 * @param entities
 * @param fn
 * @returns {Array}
 */
import { IEntityMap } from "../../interfaces";
export declare function entityLoop<T>(entities: T[] | IEntityMap<T>, fn: (ent: T) => boolean | void): T[];
export default entityLoop;
