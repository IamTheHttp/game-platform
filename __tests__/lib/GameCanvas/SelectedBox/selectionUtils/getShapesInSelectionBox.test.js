import getShapesInSelectionBox from 'lib/GameCanvas/selectionUtils/getShapesInSelectionBox';
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

    shapes.set('bar22', new Shape(() => {}, {
      id: 'bar22',
      type: 'UNSUPPORTED TYPE',
      x : 20,
      y : 20,
      radius: 5
    }));

    expect(getShapesInSelectionBox(shapes, {
      start : {
        x:0,
        y:0
      },
      end: {
        x: 0,
        y: 0
      }
    }).length).toBe(0);

    expect(getShapesInSelectionBox(shapes, {
      start : {
        x:-100,
        y:-100
      },
      end: {
        x: 100,
        y: 100
      }
    }).length).toBe(2);

    expect(getShapesInSelectionBox(shapes, {
      start : {
        x:14,
        y:14
      },
      end: {
        x: 16,
        y: 16
      }
    }).length).toBe(1);

    expect(getShapesInSelectionBox(shapes, {
      start : {
        x:14,
        y:14
      },
      end: {
        x: 26,
        y: 26
      }
    }).length).toBe(2);

    expect(getShapesInSelectionBox(shapes, {
      start : {
        x:150,
        y:150
      },
      end: {
        x: 250,
        y: 250
      }
    }).length).toBe(0);

    expect(getShapesInSelectionBox(shapes, {
      start : {
        x:250,
        y:250
      },
      end: {
        x: 0,
        y: 0
      }
    }).length).toBe(2);
  });
});