import getShapesFromClick from 'lib/GameCanvas/selectionUtils/getShapesFromClick';
import {Shape} from 'lib/CanvasAPI/CanvasAPI';


describe('is a position inside a circle tests', () => {
  it('works', () => {
    let shapes = new Map();

    shapes.set('foo', new Shape(() => {}, {
      id: 'foo',
      type: 'circle',
      x : 15,
      y : 15,
      radius: 5
    }));

    shapes.set('bar', new Shape(() => {}, {
      id: 'bar',
      type: 'circle',
      x : 20,
      y : 20,
      radius: 5
    }));

    expect(getShapesFromClick(shapes, 15, 15).length).toBe(1);
    expect(getShapesFromClick(shapes, 18, 18).length).toBe(2);
    expect(getShapesFromClick(shapes, 20, 20).length).toBe(1);
    expect(getShapesFromClick(shapes, 200, 200).length).toBe(0);
  });
});