export function entityLoop(entities, fn) {
    var ents = [];
    if (Array.isArray(entities)) {
        entities.forEach(function (ent) {
            fn(ent) && ents.push(ent);
        });
    }
    else {
        Object.keys(entities).forEach(function (entID) {
            fn(entities[+entID]) && ents.push(entities[+entID]);
        });
    }
    return ents;
}
export default entityLoop;
