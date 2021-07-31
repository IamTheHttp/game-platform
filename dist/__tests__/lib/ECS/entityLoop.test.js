import { Entity, entityLoop } from "../../../src";
describe('Tests the entity loop', function () {
    beforeEach(function () {
        Entity.reset();
    });
    it('does not crash when empty', function () {
        new Entity(null);
        var runs = 0;
        entityLoop(Entity.getByComps(['lol']), function () {
            runs++;
            return true;
        });
        expect(runs).toBe(0);
    });
    it('Loops on Entity arrays', function () {
        var foo = new Entity(null);
        foo.addComponent({
            name: 'lol'
        });
        var runs = 0;
        var entities = entityLoop(Entity.getByComps(['lol']), function (ent) {
            runs++;
            expect(ent).not.toBeUndefined();
            return true;
        });
        expect(entities.length).toBe(1);
        expect(runs).toBe(1);
    });
    it('works on objects', function () {
        new Entity(null);
        var runs = 0;
        var entities = entityLoop(Entity.entities, function (ent) {
            runs++;
            expect(ent).not.toBeUndefined();
            return true;
        });
        expect(entities.length).toBe(1);
        expect(runs).toBe(1);
    });
});
