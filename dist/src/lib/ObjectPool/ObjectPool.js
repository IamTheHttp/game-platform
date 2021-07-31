var ObjectPool = /** @class */ (function () {
    function ObjectPool(PooledClass, incrementWhenEmpty) {
        if (incrementWhenEmpty === void 0) { incrementWhenEmpty = 10; }
        this.type = PooledClass;
        var foo = new this.type();
        this.freePool = [];
        this.stats = {
            free: 0,
            used: 0
        };
        this.incrementWhenEmpty = incrementWhenEmpty;
    }
    ObjectPool.prototype.reset = function () {
        this.freePool = [];
        this.stats = {
            free: 0,
            used: 0
        };
    };
    // Ensures the pool has at least $amount of free objects
    ObjectPool.prototype.generate = function (amount) {
        var count = amount - this.stats.free > 0 ? amount - this.stats.free : 0;
        // generate a gazzilion fighters?
        while (count > 0) {
            this.freePool.push(new this.type());
            count--;
        }
        this.stats.free = this.freePool.length;
    };
    // acquires an object, marks it as 'used'.
    ObjectPool.prototype.acquire = function () {
        if (this.freePool.length === 0) {
            this.generate(this.incrementWhenEmpty);
        }
        var obj = this.freePool.pop();
        this.stats.free = this.freePool.length;
        return obj;
    };
    // releases an object, marks it as free
    ObjectPool.prototype.release = function (object) {
        // prevent release twice
        if (this.freePool.indexOf(object) === -1) {
            this.freePool.push(object);
            this.stats.free = this.freePool.length;
        }
    };
    return ObjectPool;
}());
export default ObjectPool;
