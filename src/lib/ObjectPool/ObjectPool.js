
// TODO - Total isn't implemented here..
class ObjectPool {
  constructor(PooledClass) {
    this.type = PooledClass;
    this.freePool = [];
    this.stats = {
      free: 0,
      used: 0,
      total: 0
    };
    this.incrementWhenEmpty = 10;
  }

  reset() {
    this.freePool = [];
    this.stats = {
      free: 0,
      used: 0,
      total: 0
    };
  }
  // for starting up - we can generate what we need.
  generate(amount) {
    let count = amount;
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
  release(object) {
    // prevent release twice
    if (this.freePool.indexOf(object) === -1) {
      this.freePool.push(object);
      this.stats.free = this.freePool.length;
    }
  }
}

export default ObjectPool;