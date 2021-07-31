import { Shape } from "../../../../../src/lib/CanvasAPI/Shapes/Shape";
import getShapesFromClick from "../../../../../src/lib/GameCanvas/selectionUtils/getShapesFromClick";
describe('Check click detection against various shapes', function () {
    it('Tests circles', function () {
        var shapes = new Map();
        shapes.set('foo', new Shape(function () { }, {
            id: 'foo',
            type: 'circle',
            x: 15,
            y: 15,
            radius: 5
        }));
        shapes.set('bar', new Shape(function () { }, {
            id: 'bar',
            type: 'circle',
            x: 20,
            y: 20,
            radius: 5
        }));
        shapes.set('bar22', new Shape(function () { }, {
            id: 'bar22',
            type: 'UNSUPPORTED TYPE',
            x: 20,
            y: 20,
            radius: 5
        }));
        expect(getShapesFromClick(shapes, 'initial', 15, 15).length).toBe(1);
        expect(getShapesFromClick(shapes, 'initial', 18, 18).length).toBe(2);
        expect(getShapesFromClick(shapes, 'initial', 20, 20).length).toBe(1);
        expect(getShapesFromClick(shapes, 'initial', 200, 200).length).toBe(0);
    });
    it('Tests rects and images', function () {
        var shapes = new Map();
        shapes.set('foo', new Shape(function () { }, {
            id: 'foo',
            type: 'rect',
            x: 10,
            y: 10,
            width: 10,
            height: 10
        }));
        shapes.set('bar', new Shape(function () { }, {
            id: 'bar',
            type: 'image',
            x: 15,
            y: 15,
            width: 10,
            height: 10
        }));
        shapes.set('bar22', new Shape(function () { }, {
            id: 'bar22',
            type: 'UNSUPPORTED TYPE',
            x: 20,
            y: 20,
            width: 10,
            height: 10
        }));
        expect(getShapesFromClick(shapes, 'initial', 13, 13).length).toBe(1);
        expect(getShapesFromClick(shapes, 'initial', 18, 18).length).toBe(2);
        expect(getShapesFromClick(shapes, 'initial', 22, 22).length).toBe(1);
        expect(getShapesFromClick(shapes, 'initial', 200, 200).length).toBe(0);
    });
});
