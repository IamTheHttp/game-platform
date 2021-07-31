/* global describe */
/* global it */
/* global expect */
/* global beforeEach */
import ObjectPool from 'lib/ObjectPool/ObjectPool';
var Foo = /** @class */ (function () {
    function Foo() {
        this.isAlive = true;
    }
    return Foo;
}());
describe('Tests a component', function () {
    var pool;
    beforeEach(function () {
        pool = new ObjectPool(Foo);
    });
    it('Generates the objects', function () {
        pool.generate(100);
        expect(pool.stats.free).toBe(100);
    });
    it('Acquires an object instance', function () {
        pool.generate(100);
        var obj = pool.acquire();
        expect(obj.isAlive).toBe(true);
        expect(pool.stats.free).toBe(99);
        pool.release(obj);
        expect(pool.stats.free).toBe(100);
    });
    it('Generate should create UP TO the number provided', function () {
        pool.generate(100);
        pool.generate(100);
        pool.generate(100);
        expect(pool.stats.free).toBe(100);
        var i = 0;
        while (i < 500) {
            i++;
            var obj = pool.acquire();
            expect(obj.isAlive).toBe(true);
        }
        expect(pool.stats.free).toBe(0);
        pool.generate(100);
        expect(pool.stats.free).toBe(100);
    });
    it('Acquires more than allocated amount', function () {
        expect(pool.stats.free).toBe(0);
        var obj = pool.acquire();
        expect(pool.stats.free).toBe(pool.incrementWhenEmpty - 1);
        expect(obj.isAlive).toBe(true);
        pool.release(obj);
        expect(pool.stats.free).toBe(pool.incrementWhenEmpty);
    });
    it('Release twice should not increment free twice', function () {
        pool.generate(100);
        var obj = pool.acquire();
        expect(obj.isAlive).toBe(true);
        pool.release(obj);
        pool.release(obj);
        pool.release(obj);
        expect(pool.stats.free).toBe(100);
    });
});
