/* global describe */
/* global it */
/* global expect */
/* global beforeEach */

import Engine from 'lib/Engine/Engine';

describe('Tests the Engine class', () => {
  let engine;
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
});