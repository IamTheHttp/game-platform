import entityLoop from 'lib/ECS/util/entityLoop';
import Entity from 'lib/ECS/Entity';


describe('Tests the entity loop', () => {
  beforeEach(() => {
    Entity.reset();
  });
  it ('does not crash when empty', () => {
    new Entity(null);
    let runs = 0;
    entityLoop(Entity.getByComps(['lol']), () => {
      runs++;
      return true;
    });
    expect(runs).toBe(0);
  });

  it ('Loops on Entity arrays', () => {
    let foo = new Entity(null);

    foo.addComponent({
      name : 'lol'
    });

    let runs = 0;
    let entities = entityLoop(Entity.getByComps(['lol']), (ent) => {
      runs++;
      expect(ent).not.toBeUndefined();
      return true;
    });

    expect(entities.length).toBe(1);
    expect(runs).toBe(1);
  });

  it('works on objects', () => {
    new Entity(null);

    let runs = 0;
    let entities = entityLoop(Entity.entities, (ent) => {
      runs++;
      expect(ent).not.toBeUndefined();
      return true;
    });

    expect(entities.length).toBe(1);
    expect(runs).toBe(1);
  });
});