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
    });
    expect(runs).toBe(0);
  });

  it ('does not crash when empty', () => {
    let foo = new Entity();

    foo.addComponent({
      name : 'lol'
    });

    let runs = 0;
    entityLoop(Entity.getByComps('lol'), (ent) => {
      runs++;
      expect(ent).not.toBeUndefined();
    });
    expect(runs).toBe(1);
  });
});