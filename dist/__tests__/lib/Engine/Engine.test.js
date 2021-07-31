import { Engine } from "../../../src";
describe('Tests the Engine class', function () {
    var engine;
    beforeEach(function () {
        engine = new Engine();
    });
    it('Engine runs', function (done) {
        var mockFn = jest.fn();
        engine.addSystem(function (systemArguments) {
            expect(systemArguments.foo).toBe('bar');
            done();
        });
        engine.run({
            foo: 'bar'
        });
    });
    it('Engine should cancel the animation frame', function (done) {
        engine.addSystem(function (systemArguments) {
            expect(true).toBe(false); // this never happens because we stop the engine
        });
        var frameID = engine.run({
            foo: 'bar'
        });
        expect(engine.stop()).toBe(frameID);
        process.nextTick(function () {
            done();
        });
    });
    it('Engine supports a function for sysArgs', function (done) {
        var mockFn = jest.fn();
        engine.addSystem(function (systemArguments) {
            expect(systemArguments.foo).toBe('bar');
            done();
        });
        engine.run(function () {
            return {
                foo: 'bar'
            };
        });
    });
});
