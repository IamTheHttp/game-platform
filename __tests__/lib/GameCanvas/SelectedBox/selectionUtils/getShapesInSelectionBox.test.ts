import getShapesInSelectionBox from 'lib/GameCanvas/selectionUtils/getShapesInSelectionBox';
import {Shapes} from "lib/CanvasAPI/Shapes/Shapes";
import getShapesFromClick from 'lib/GameCanvas/selectionUtils/getShapesFromClick';


describe('Test selectionBox shape detection', () => {
  it('Tests circles', () => {
    let shapes = new Map();

    shapes.set('foo', new Shapes(() => {
    }, {
      id: 'foo',
      type: 'circle',
      x: 15,
      y: 15,
      radius: 5
    }));

    shapes.set('bar', new Shapes(() => {
    }, {
      id: 'bar',
      type: 'circle',
      x: 20,
      y: 20,
      radius: 5
    }));

    shapes.set('bar22', new Shapes(() => {
    }, {
      id: 'bar22',
      type: 'UNSUPPORTED TYPE',
      x: 20,
      y: 20,
      radius: 5
    }));

    expect(getShapesInSelectionBox(shapes, 'initial',{
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 0,
        y: 0
      }
    }).length).toBe(0);

    expect(getShapesInSelectionBox(shapes, 'initial',{
      start: {
        x: -100,
        y: -100
      },
      end: {
        x: 100,
        y: 100
      }
    }).length).toBe(2);

    expect(getShapesInSelectionBox(shapes, 'initial',{
      start: {
        x: 14,
        y: 14
      },
      end: {
        x: 16,
        y: 16
      }
    }).length).toBe(1);

    expect(getShapesInSelectionBox(shapes, 'initial',{
      start: {
        x: 14,
        y: 14
      },
      end: {
        x: 26,
        y: 26
      }
    }).length).toBe(2);

    expect(getShapesInSelectionBox(shapes, 'initial',{
      start: {
        x: 150,
        y: 150
      },
      end: {
        x: 250,
        y: 250
      }
    }).length).toBe(0);

    expect(getShapesInSelectionBox(shapes, 'initial',{
      start: {
        x: 250,
        y: 250
      },
      end: {
        x: 0,
        y: 0
      }
    }).length).toBe(2);
  });


  it('Tests rects', () => {
    let shapes = new Map();

    shapes.set('foo', new Shapes(() => {
    }, {
      id: 'foo',
      type: 'rect',
      x: 10,
      y: 10,
      width: 10,
      height: 10
    }));

    shapes.set('bar', new Shapes(() => {
    }, {
      id: 'bar',
      type: 'rect',
      x: 15,
      y: 15,
      width: 10,
      height: 10
    }));

    shapes.set('bar22', new Shapes(() => {
    }, {
      id: 'bar22',
      type: 'UNSUPPORTED TYPE',
      x: 20,
      y: 20,
      width: 10,
      height: 10
    }));

    expect(getShapesInSelectionBox(shapes, 'initial', {
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 20,
        y: 20
      }
    }).length).toBe(2);

    expect(getShapesInSelectionBox(shapes, 'initial', {
      start: {
        x: 14,
        y: 14
      },
      end: {
        x: 16,
        y: 16
      }
    }).length).toBe(1);
  });
});