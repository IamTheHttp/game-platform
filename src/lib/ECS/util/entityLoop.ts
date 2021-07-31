/**
 * used to loop over and possibly filter entities
 * Accepts either a map of Entities with EntityID as Key, or an array
 * if the CB returns true, an array of entities that return true is returned.
 * @param entities
 * @param fn
 * @returns {Array}
 */
import {IEntityMap} from "../../interfaces";

export function entityLoop<T>(entities: T[] | IEntityMap<T>, fn: (ent:T) => boolean | void): T[] {
  let ents:T[] = [];

  if (Array.isArray(entities)) {
    entities.forEach((ent) => {
      fn(ent) && ents.push(ent);
    });
  } else {
    Object.keys(entities).forEach((entID) => {
      fn(entities[+entID]) && ents.push(entities[+entID]);
    });
  }

  return ents;
}

export default entityLoop;
