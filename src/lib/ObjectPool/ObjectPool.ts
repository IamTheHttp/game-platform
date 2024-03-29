interface IStats {
  free: number;
  used: number;
}

class ObjectPool<T> {
  type: new () => T;
  freePool: Array<any>;
  stats: IStats;
  incrementWhenEmpty: number;

  constructor(PooledClass: new () => T, incrementWhenEmpty = 10) {
    this.type = PooledClass;

    const foo = new this.type();
    this.freePool = [];
    this.stats = {
      free: 0,
      used: 0
    };
    this.incrementWhenEmpty = incrementWhenEmpty;
  }

  reset() {
    this.freePool = [];
    this.stats = {
      free: 0,
      used: 0
    };
  }

  // Ensures the pool has at least $amount of free objects
  generate(amount: number) {
    let count = amount - this.stats.free > 0 ? amount - this.stats.free : 0;
    // generate a gazzilion fighters?
    while (count > 0) {
      this.freePool.push(new this.type());
      count--;
    }
    this.stats.free = this.freePool.length;
  }

  // acquires an object, marks it as 'used'.
  acquire() {
    if (this.freePool.length === 0) {
      this.generate(this.incrementWhenEmpty);
    }
    let obj = this.freePool.pop();
    this.stats.free = this.freePool.length;
    return obj;
  }

  // releases an object, marks it as free
  release(object: T) {
    // prevent release twice
    if (this.freePool.indexOf(object) === -1) {
      this.freePool.push(object);
      this.stats.free = this.freePool.length;
    }
  }
}

export default ObjectPool;
