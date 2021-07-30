/**
 * used to loop over and possibly filter entities
 * Accepts either a map of Entities with EntitiyID as Key, or an array
 * if the CB returns true, an array of entities that return true is returned.
 * @param entities
 * @param fn
 * @returns {Array}
 */
export default (function (entities, fn) {
    var ents = [];
    if (entities.forEach) {
        entities.forEach(function (ent) {
            fn(ent) && ents.push(ent);
        });
    }
    else {
        Object.keys(entities).forEach(function (entID) {
            fn(entities[entID]) && ents.push(entities[entID]);
        });
    }
    return ents;
});
