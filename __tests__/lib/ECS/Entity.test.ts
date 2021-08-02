import {Entity} from "../../../src";
import spliceOne from "../../../src/lib/ECS/util/spliceOne";

describe('Tests for entities', () => {
  beforeEach(() => {
    Entity.reset();
  });

  it('tests the spliceOne method', () => {
    let arr = [1, 2, 3];
    // no index defaults to index 0
    spliceOne(arr);
    expect(arr.length).toBe(2);
    expect(arr[0]).toBe(2);


    // out of bound index shouldn't change anything
    arr = [1, 2, 3];
    spliceOne(arr, 55);
    expect(arr.length).toBe(3);
    expect(arr[0]).toBe(1);

    // out of bound index shouldn't change anything
    arr = [1, 2, 3];
    spliceOne(arr, 1);
    expect(arr.length).toBe(2);
    expect(arr[1]).toBe(3);

    // empty arr shouldn't crash
    arr = [];
    spliceOne(arr);
    expect(arr.length).toBe(0);
  });

  it('Creates a new entity', () => {
    let e = new Entity(null);
    expect(e.id).not.toBeUndefined();
    expect(e.components).toEqual({});
  });

  it('Tests that internal groups are created correctly', () => {
    let e = new Entity(null);
    let comp = {name:'test', foo:'bar'};
    let e2 = new Entity(null);
    let comp2 = {name:'foo', foo:'test'};

    e.addComponent(comp);
    e2.addComponent(comp2);
    expect(e.components.test).toBe(comp);
    e.removeComponent(comp);
    expect(e.components.test).toBeUndefined();
  });

  it('Adds and removes components', () => {
    let e = new Entity(null);
    let comp = {name:'test', foo:'bar'};
    e.addComponent(comp);
    expect(e.components.test).toBe(comp);
    e.removeComponent(comp);
    expect(e.components.test).toBeUndefined();
  });

  it('Tests the hasComponent method', () => {
    let e = new Entity(null);
    let comp1 = {name:'test1', foo:'bar'};
    e.addComponent(comp1);
    let comp2 = {name:'test2', foo:'bar'};
    e.addComponent(comp2);

    expect(e.hasComponents('test1')).toBe(true);
    expect(e.hasComponents(['test1'])).toBe(true);
    expect(e.hasComponents(['test1', 'test2'])).toBe(true);
    expect(e.hasComponents(['anotherComp'])).toBe(false);
    expect(e.hasComponents('anotherComp')).toBe(false);
    expect(e.hasComponents()).toBe(false);
  });

  it('Test the getByComp static method', () => {
    let e = new Entity(null);

    let comp1 = {name:'test1', foo:'bar'};
    e.addComponent(comp1);
    let comp2 = {name:'test2', foo:'bar'};
    e.addComponent(comp2);

    let e2 = new Entity(null);

    e2.addComponent(comp1);
    let resp;
    resp = Entity.getByComps(['test1'], 'map');
    expect(resp[e.id]).toBe(e);
    expect(resp[e2.id]).toBe(e2);

    resp = Entity.getByComps(['test1']);
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
    resp = Entity.getByComps(['test1', 'test2', 'nonExistent'], 'map');
    expect(resp).toEqual({});

    // no components provided.. which means return all?
    resp = Entity.getByComps([], 'map');
    expect(resp[e.id]).toBe(e);
    expect(resp[e2.id]).toBe(e2);
  });

  it('Entity can destroy itself', () => {
    let e = new Entity(null);
    let comp1 = {name:'test1', foo:'bar'};

    e.addComponent(comp1);
    // always returns a collection
    expect(Entity.getByComps(['test1'])[0]).toBe(e);

    e.destroy();
    expect(Entity.entities[e.id]).toBeUndefined();

    // the point of the test is to ensure we got back an array
    let resp = Entity.getByComps(['test1'], 'array') as any;
    expect(resp.length).toBe(0);
  });

  it('Does not crash when an unknown component is removed', () => {
    let e = new Entity(null);
    e.removeComponent('foo');
  });
});