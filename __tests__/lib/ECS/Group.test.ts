import {Entity} from "../../../src";
import Group from "../../../src/lib/ECS/Group";

describe('Tests a component', () => {
  beforeEach(() => {
    Entity.reset();
  });

  it('resets the groups to an empty object', () => {
    Group.groups = {
      'foo': new Group(['foo'])
    }
    Group.reset();
    expect(Group.groups).toEqual({});
  });

  it('Indexes a group correctly', () => {
    let ent = new Entity(null);
    Group.indexGroup(['test1', 'test2', 'test3'], {[ent.id] : ent});
    // Group.reset();
    expect(Group.groups['test1-test2-test3']).not.toBeUndefined();
  });

  it('ensure getGroup returns sane defaults', () => {
    let group = Group.getGroup(['test1', 'test2', 'test3']);
    expect(group).toEqual({});
  });

  it('ensure getGroup gets the correct group', () => {
    let ent = new Entity(null);

    ent.addComponent({
      name: 'test1'
    });
    ent.addComponent({
      name: 'test2'
    });
    ent.addComponent({
      name: 'test3'
    });
    Group.indexGroup(['test1', 'test2', 'test3'], {[ent.id] : ent});

    let group = Group.getGroup(['test1', 'test2', 'test3']);

    expect(group.components.length).toBe(3);
    expect(group.array.length).toEqual(1);
  });
});