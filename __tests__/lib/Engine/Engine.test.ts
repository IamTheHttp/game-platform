import {Engine} from '../../../src';

describe('Tests the Engine class', () => {
  let engine: Engine;
  beforeEach(() => {
    engine = new Engine();
  });

  it('Engine runs', (done) => {
    let mockFn = jest.fn();
    engine.addSystem((systemArguments) => {
      expect(systemArguments.foo).toBe('bar');
      done();
    });

    engine.run({
      foo: 'bar'
    });
  });

  it('Engine should cancel the animation frame', (done) => {
    engine.addSystem((systemArguments) => {
      expect(true).toBe(false); // this never happens because we stop the engine
    });

    let frameID = engine.run({
      foo: 'bar'
    });

    expect(engine.stop()).toBe(frameID);

    process.nextTick(() => {
      done();
    });
  });

  it('Engine supports a function for sysArgs', (done) => {
    let mockFn = jest.fn();
    engine.addSystem((systemArguments) => {
      expect(systemArguments.foo).toBe('bar');
      done();
    });

    engine.run(() => {
      return {
        foo: 'bar'
      };
    });
  });
});
