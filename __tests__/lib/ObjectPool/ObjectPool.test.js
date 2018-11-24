/* global describe */
/* global it */
/* global expect */
/* global beforeEach */
import ObjectPool from 'lib/ObjectPool/ObjectPool';
describe('Tests a component', () => {
  let pool;
  class Foo {
    constructor() {
      this.isAlive = true;
    }
  }
  beforeEach(() => {
    pool = new ObjectPool(Foo);
  });

  it('Generates the objects', () => {
    pool.generate(100);
    expect(pool.stats.free).toBe(100);
  });

  it('Acquires an object instance', () => {
    pool.generate(100);
    let obj = pool.acquire();
    expect(obj.isAlive).toBe(true);
    expect(pool.stats.free).toBe(99);
  });

  it('Acquires an object instance', () => {
    pool.generate(100);
    let obj = pool.acquire();
    pool.release(obj);
    expect(pool.stats.free).toBe(100);
  });

  it('Acquires more than allocated amount', () => {
    pool.reset();
    expect(pool.stats.free).toBe(0);
    let obj = pool.acquire();
    expect(pool.stats.free).toBe(pool.incrementWhenEmpty - 1);
    expect(obj.isAlive).toBe(true);
    pool.release(obj);
    expect(pool.stats.free).toBe(pool.incrementWhenEmpty);
  });

  it('Release twice should not increment free twice', () => {
    pool.generate(100);
    let obj = pool.acquire();
    expect(obj.isAlive).toBe(true);
    pool.release(obj);
    pool.release(obj);
    pool.release(obj);
    expect(pool.stats.free).toBe(100);
  });
});