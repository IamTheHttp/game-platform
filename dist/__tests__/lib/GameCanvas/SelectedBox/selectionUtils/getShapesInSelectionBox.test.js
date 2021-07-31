import { Shape } from "../../../../../src/lib/CanvasAPI/Shapes/Shape";
import getShapesInSelectionBox from "../../../../../src/lib/GameCanvas/selectionUtils/getShapesInSelectionBox";
describe('Test selectionBox shape detection', function () {
    it('Tests circles', function () {
        var shapes = new Map();
        shapes.set('foo', new Shape(function () {
        }, {
            id: 'foo',
            type: 'circle',
            x: 15,
            y: 15,
            radius: 5
        }));
        shapes.set('bar', new Shape(function () {
        }, {
            id: 'bar',
            type: 'circle',
            x: 20,
            y: 20,
            radius: 5
        }));
        shapes.set('bar22', new Shape(function () {
        }, {
            id: 'bar22',
            type: 'UNSUPPORTED TYPE',
            x: 20,
            y: 20,
            radius: 5
        }));
        expect(getShapesInSelectionBox(shapes, 'initial', {
            width: 0,
            height: 0,
            start: {
                x: 0,
                y: 0
            },
            end: {
                x: 0,
                y: 0
            }
        }).length).toBe(0);
        expect(getShapesInSelectionBox(shapes, 'initial', {
            width: 200,
            height: 200,
            start: {
                x: -100,
                y: -100
            },
            end: {
                x: 100,
                y: 100
            }
        }).length).toBe(2);
        expect(getShapesInSelectionBox(shapes, 'initial', {
            width: 2,
            height: 2,
            start: {
                x: 14,
                y: 14
            },
            end: {
                x: 16,
                y: 16
            }
        }).length).toBe(1);
        expect(getShapesInSelectionBox(shapes, 'initial', {
            width: 12,
            height: 12,
            start: {
                x: 14,
                y: 14
            },
            end: {
                x: 26,
                y: 26
            }
        }).length).toBe(2);
        expect(getShapesInSelectionBox(shapes, 'initial', {
            width: 100,
            height: 100,
            start: {
                x: 150,
                y: 150
            },
            end: {
                x: 250,
                y: 250
            }
        }).length).toBe(0);
        expect(getShapesInSelectionBox(shapes, 'initial', {
            width: 250,
            height: 250,
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
    it('Tests rects', function () {
        var shapes = new Map();
        shapes.set('foo', new Shape(function () {
        }, {
            id: 'foo',
            type: 'rect',
            x: 10,
            y: 10,
            width: 10,
            height: 10
        }));
        shapes.set('bar', new Shape(function () {
        }, {
            id: 'bar',
            type: 'rect',
            x: 15,
            y: 15,
            width: 10,
            height: 10
        }));
        shapes.set('bar22', new Shape(function () {
        }, {
            id: 'bar22',
            type: 'UNSUPPORTED TYPE',
            x: 20,
            y: 20,
            width: 10,
            height: 10
        }));
        expect(getShapesInSelectionBox(shapes, 'initial', {
            width: 20,
            height: 20,
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
            width: 2,
            height: 2,
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
