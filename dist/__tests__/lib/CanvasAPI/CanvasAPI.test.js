/* global describe */
/* global it */
/* global expect */
/* global beforeEach */
import CanvasAPI from 'lib/CanvasAPI/CanvasAPI';
describe('Tests the CanvasAPI', function () {
    var canvasAPI;
    var canvasWidth = 200;
    var canvasHeight = 500;
    beforeEach(function () {
        var parent = document.createElement('div');
        var canvas = document.createElement('canvas');
        parent.appendChild(canvas);
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvasAPI = new CanvasAPI({
            measureText: function (a) {
                return {
                    width: 100
                };
            },
            font: '10px ariel',
            save: jest.fn(),
            setTransform: jest.fn(),
            clearRect: jest.fn(),
            restore: jest.fn(),
            beginPath: jest.fn(),
            rect: jest.fn(),
            fillText: jest.fn(),
            fill: jest.fn(),
            arc: jest.fn(),
            stroke: jest.fn(),
            closePath: jest.fn(),
            moveTo: jest.fn(),
            canvas: canvas,
        });
    });
    it('cannot instantiate without ctx', function () {
        expect(function () {
            new CanvasAPI(null, null);
        }).toThrow();
    });
    it('inits CanvasAPI', function () {
        var ctx = canvasAPI.layers.initial.ctx;
        var layer = canvasAPI.layers.initial;
        expect(ctx.strokeStyle).toBe('white');
        expect(layer.shapes.size).toBe(0);
    });
    it('Adds a shape, renders, and clears', function () {
        var layer = canvasAPI.layers.initial;
        var ctx = layer.ctx;
        var x = 15;
        var y = 10;
        var width = 100;
        var height = 50;
        expect(layer.shapes.size).toBe(0);
        canvasAPI.addRect({
            id: 'rect',
            x: x,
            y: y,
            width: width,
            height: height
        });
        expect(layer.shapes.size).toBe(1);
        canvasAPI.draw();
        expect(ctx.clearRect.mock.calls[0]).toEqual([0, 0, canvasWidth, canvasHeight]);
        expect(ctx.rect.mock.calls[0]).toEqual([x, y, width, height]);
        canvasAPI.clear();
        expect(layer.shapes.size).toBe(0);
    });
    it('Adds a circle, renders  and remove it', function () {
        var layer = canvasAPI.layers.initial;
        var ctx = layer.ctx;
        var x = 15;
        var y = 10;
        var radius = 500;
        expect(layer.shapes.size).toBe(0);
        canvasAPI.addCircle({
            id: 'circle',
            x: x,
            y: y,
            radius: radius
        });
        canvasAPI.addCircle({
            id: 'yellowCircle',
            x: x,
            y: y,
            radius: radius,
            fillColor: 'yellow'
        });
        expect(layer.shapes.size).toBe(2);
        canvasAPI.draw();
        expect(ctx.arc.mock.calls[0]).toEqual([x, y, radius, 0, Math.PI * 2]);
        expect(ctx.fill.mock.calls[0]).toBeDefined();
        canvasAPI.remove('circle');
        expect(layer.shapes.size).toBe(1);
    });
    it('write a text', function () {
        var layer = canvasAPI.layers.initial;
        var ctx = layer.ctx;
        var x = 15;
        var y = 10;
        expect(layer.shapes.size).toBe(0);
        canvasAPI.write({
            id: 'text',
            text: 'test',
            x: x,
            y: y,
            textBaseline: 'top',
            fillStyle: 'white'
        });
        expect(layer.shapes.size).toBe(1);
        canvasAPI.draw();
        expect(ctx.fillText.mock.calls[0]).toEqual(['test', x, y]);
        canvasAPI.remove('text');
        expect(layer.shapes.size).toBe(0);
    });
    it('Sets and get pan values', function () {
        var layer = canvasAPI.layers.initial;
        var ctx = layer.ctx;
        expect(canvasAPI.getPan()).toEqual({
            panX: 0,
            panY: 0
        });
        canvasAPI.pan(100, 100);
        expect(ctx.setTransform.mock.calls[0]).toEqual([1, 0, 0, 1, 100, 100]);
        expect(canvasAPI.getPan()).toEqual({
            panX: 100,
            panY: 100
        });
    });
    it('Adds a circle to a different layer, clearing one layer should not clear the other', function () {
        var layer = canvasAPI.layers.initial;
        var x = 15;
        var y = 10;
        var radius = 5;
        canvasAPI.addCircle({
            id: 'circle',
            x: x,
            y: y,
            radius: radius
        });
        canvasAPI.addLayer('otherLayer');
        canvasAPI.addCircle({
            id: 'circle',
            x: x,
            y: y,
            radius: radius,
            layerName: 'otherLayer'
        });
        expect(layer.shapes.size).toBe(1);
        canvasAPI.clear();
        expect(layer.shapes.size).toBe(0);
        expect(canvasAPI.layers.otherLayer.shapes.size).toBe(1);
    });
    it('Can remove a layer once it was added', function () {
        canvasAPI.addLayer('otherLayer');
        canvasAPI.addCircle({
            id: 'circle',
            x: 5,
            y: 5,
            radius: 5,
            layerName: 'otherLayer'
        });
        canvasAPI.removeLayer('otherLayer');
        expect(canvasAPI.layers.otherLayer).toBeFalsy();
    });
    it('Adds an arc to the shapes', function () {
        var layer = canvasAPI.layers.initial;
        var ctx = layer.ctx;
        var x = 100;
        var y = 100;
        var radius = 500;
        var direction = 1;
        var size = 1;
        var fillColor = 'green';
        canvasAPI.addArc({
            id: 'myArc',
            x: x,
            y: y,
            radius: radius,
            direction: direction,
            size: size,
            fillColor: fillColor
        });
        expect(layer.shapes.size).toBe(1);
        canvasAPI.draw();
        expect(ctx.arc.mock.calls[0]).toEqual([x, y, radius, (direction - size / 2) * Math.PI, (direction + size / 2) * Math.PI]);
        expect(ctx.fill.mock.calls[0]).toBeDefined();
    });
    it('Adds an arc without FillColor', function () {
        var layer = canvasAPI.layers.initial;
        var ctx = layer.ctx;
        var x = 100;
        var y = 100;
        var radius = 500;
        var direction = 1;
        var size = 1;
        canvasAPI.addArc({
            id: 'myArc',
            x: x,
            y: y,
            radius: radius,
            direction: direction,
            size: size
        });
        canvasAPI.draw();
        expect(ctx.arc.mock.calls.length).toBeGreaterThan(0);
        expect(ctx.fill.mock.calls[0]).toBeUndefined();
    });
    it('clear all layers', function () {
        canvasAPI.addLayer('otherLayer');
        canvasAPI.addLayer('otherLayer2');
        canvasAPI.addCircle({
            id: 'circle',
            x: 5,
            y: 5,
            radius: 5,
            layerName: 'otherLayer'
        });
        canvasAPI.addCircle({
            id: 'circle',
            x: 5,
            y: 5,
            radius: 5,
            layerName: 'otherLayer2'
        });
        expect(canvasAPI.layers.otherLayer.shapes.size).toBeTruthy();
        expect(canvasAPI.layers.otherLayer2.shapes.size).toBeTruthy();
        canvasAPI.clearAllLayers();
        expect(canvasAPI.layers.otherLayer.shapes.size).toBeFalsy();
        expect(canvasAPI.layers.otherLayer2.shapes.size).toBeFalsy();
    });
    it('Writes a bubble text to the canvas', function () {
        canvasAPI.writeBubble({
            id: 'testBubbleText',
            text: 'It is dangerous to go alone! \ntake this!',
            backgroundColor: 'green',
            borderColor: 'orange',
            borderWidth: 0,
            fontColor: 'purple',
            x: 0,
            y: 0,
            height: 0,
            width: 0,
            fontSize: 16,
            paddingLeft: 0,
            paddingTop: 0
        });
        // even though 0 height and 0 width were given, the string length and many lines force some size
        var shape = canvasAPI.layers.initial.shapes.get('testBubbleText');
        expect(shape.metaData.height).toBeGreaterThan(0);
        expect(shape.metaData.width).toBe(100);
    });
    it('Writes a bubble text to the canvas - Takes into account padding for height calculations', function () {
        canvasAPI.writeBubble({
            id: 'testBubbleText',
            text: 'It is dangerous to go alone! \ntake this!',
            backgroundColor: 'green',
            borderColor: 'orange',
            borderWidth: 5,
            fontColor: 'purple',
            x: 0,
            y: 0,
            height: 0,
            width: 0,
            fontSize: 16,
            paddingLeft: 50,
            paddingTop: 0,
        });
        // even though 0 height and 0 width were given, the string length and many lines force some size
        var shape = canvasAPI.layers.initial.shapes.get('testBubbleText');
        expect(shape.metaData.height).toBeGreaterThan(0);
        expect(shape.metaData.width).toBe(205); // + padding * 2 + border + 100 from mock measureText
    });
    it('Works without missing default arguments', function () {
        canvasAPI.writeBubble({
            id: 'testBubbleText',
            text: 'It is dangerous to go alone! \ntake this!',
            backgroundColor: 'green',
            borderColor: 'orange',
            borderWidth: 5,
            fontColor: 'purple',
            x: 0,
            y: 0,
            height: 0,
            width: 0, // the minimum value is the text value within!
        });
        // even though 0 height and 0 width were given, the string length and many lines force some size
        var shape = canvasAPI.layers.initial.shapes.get('testBubbleText');
        expect(shape.metaData.height).toBeGreaterThan(0);
        expect(shape.metaData.width).toBe(125); // + padding(default 10) * 2 + border + 100 from mock measureText
    });
});
