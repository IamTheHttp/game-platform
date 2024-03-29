/* global describe */
/* global it */
/* global expect */
/* global beforeEach */
import ObjectPool from 'lib/ObjectPool/ObjectPool';

class Foo {
  isAlive: boolean;
  constructor() {
    this.isAlive = true;
  }
}

describe('Tests a component', () => {
  let pool: ObjectPool<Foo>;

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
    pool.release(obj);
    expect(pool.stats.free).toBe(100);
  });

  it('Generate should create UP TO the number provided', () => {
    pool.generate(100);
    pool.generate(100);
    pool.generate(100);
    expect(pool.stats.free).toBe(100);

    let i = 0;
    while (i < 500) {
      i++;
      let obj = pool.acquire();
      expect(obj.isAlive).toBe(true);
    }
    expect(pool.stats.free).toBe(0);
    pool.generate(100);
    expect(pool.stats.free).toBe(100);
  });

  it('Acquires more than allocated amount', () => {
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
