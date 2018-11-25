import entityLoop from 'lib/ECS/util/entityLoop';
import Entity from 'lib/ECS/Entity';


describe('Tests the entity loop', () => {
  beforeEach(() => {
    Entity.reset();
  });
  it ('does not crash when empty', () => {
    let foo = new Entity();
    let runs = 0;
    entityLoop(Entity.getByComps('lol'), (ent) => {
      runs++;
      return true;
    });
    expect(runs).toBe(0);
  });

  it ('Loops on Entity arrays', () => {
    let foo = new Entity();

    foo.addComponent({
      name : 'lol'
    });

    let runs = 0;
    let ents = entityLoop(Entity.getByComps('lol'), (ent) => {
      runs++;
      expect(ent).not.toBeUndefined();
      return true;
    });

    expect(ents.length).toBe(1);
    expect(runs).toBe(1);
  });

  it('works on objects', () => {
    new Entity();

    let runs = 0;
    let ents = entityLoop(Entity.entities, (ent) => {
      runs++;
      expect(ent).not.toBeUndefined();
      return true;
    });

    expect(ents.length).toBe(1);
    expect(runs).toBe(1);
  });
});