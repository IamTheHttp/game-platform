/* global describe */
/* global it */
/* global expect */
/* global beforeEach */

import Entity from 'lib/ECS/Entity';
describe('Tests for entities', () => {
  beforeEach(() => {
    Entity.reset();
  });
  it('Creates a new entity', () => {
    let e = new Entity();
    expect(e.id).not.toBeUndefined();
    expect(e.components).toEqual({});
  });

  it('Adds and removes components', () => {
    let e = new Entity();
    let comp = {name:'test', foo:'bar'};
    e.addComponent(comp);
    expect(e.components.test).toBe(comp);
    e.removeComponent(comp);
    expect(e.components.test).toBeUndefined();
  });

  it('Tests the hasComponent method', () => {
    let e = new Entity();
    let comp1 = {name:'test1', foo:'bar'};
    e.addComponent(comp1);
    let comp2 = {name:'test2', foo:'bar'};
    e.addComponent(comp2);

    expect(e.hasComponents(['test1'])).toBe(true);
    expect(e.hasComponents(['test1', 'test2'])).toBe(true);
    expect(e.hasComponents(['anotherComp'])).toBe(false);
    expect(e.hasComponents()).toBe(true);
  });

  it('Test the getByComp static method', () => {
    let e = new Entity();

    let comp1 = {name:'test1', foo:'bar'};
    e.addComponent(comp1);
    let comp2 = {name:'test2', foo:'bar'};
    e.addComponent(comp2);

    let e2 = new Entity();

    e2.addComponent(comp1);
    let resp;
    resp = Entity.getByComps('test1', 'map');
    expect(resp[e.id]).toBe(e);
    expect(resp[e2.id]).toBe(e2);

    resp = Entity.getByComps('test1');
    expect(resp.length).toBe(2);
    // //
    resp = Entity.getByComps(['test1'],  'map');
    expect(resp[e.id]).toBe(e);
    expect(resp[e2.id]).toBe(e2);
    resp = Entity.getByComps(['test1'],  'array');
    expect(resp.length).toBe(2);

    // only the first entity has both of them
    resp = Entity.getByComps(['test1', 'test2'], 'map');
    expect(resp[e.id]).toBe(e);
    expect(resp[e2.id]).toBeUndefined();
    resp = Entity.getByComps(['test1', 'test2'], 'array');
    expect(resp.length).toBe(1);
    //
    // // none of them have these components
    resp = Entity.getByComps(['test1', 'test2', 'nonExistant'], 'map');
    expect(resp).toEqual({});

    // no components provided.. which means return all?
    resp = Entity.getByComps([], 'map');
    expect(resp[e.id]).toBe(e);
    expect(resp[e2.id]).toBe(e2);
  });

  it('Entity can destroy itself', () => {
    let e = new Entity();
    let comp1 = {name:'test1', foo:'bar'};
    e.addComponent(comp1);
    e.destroy();
    expect(Entity.entities[e.id]).toBeUndefined();

    let resp = Entity.getByComps(['test1']);
    expect(resp.length).toBe(0);
  });
});