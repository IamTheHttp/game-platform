/* global describe */
/* global it */
/* global expect */
/* global beforeEach */
import Group from 'lib/ECS/Group';
import Entity from 'lib/ECS/Entity';
describe('Tests a component', () => {
  beforeEach(() => {
    Entity.reset();
  });

  it('resets the groups to an empty object', () => {
    Group.groups =  [1, 2, 3, 4];
    Group.reset();
    expect(Group.groups).toEqual({});
  });

  it('Indexes a group correctly', () => {
    let ent = new Entity();
    Group.indexGroup(['test1', 'test2', 'test3'], {[ent.id] : ent});
    // Group.reset();
    expect(Group.groups['test1-test2-test3']).not.toBeUndefined();
  });

  it('ensure getGroup returns sane defaults', () => {
    let group = Group.getGroup(['test1', 'test2', 'test3']);
    expect(group).toEqual({});
  });
});