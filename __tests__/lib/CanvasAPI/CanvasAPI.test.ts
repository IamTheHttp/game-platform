/* global describe */
/* global it */
/* global expect */
/* global beforeEach */

import CanvasAPI from 'lib/CanvasAPI/CanvasAPI';

describe('Tests the CanvasAPI', () => {

  let canvasAPI;
  let canvasWidth = 200;
  let canvasHeight = 500;
  beforeEach(() => {
    let parent = document.createElement('div');
    let canvas = document.createElement('canvas');
    parent.appendChild(canvas);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvasAPI = new CanvasAPI({
      measureText() {
        return {
          width: 100
        }
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
      canvas
    });
  });

  it('cannot instantiate without ctx', () => {
    expect(() => {
      let canvasAPI = new CanvasAPI();
    }).toThrow();
  });

  it('inits CanvasAPI', () => {
    let {ctx} = canvasAPI.layers.initial;
    let layer = canvasAPI.layers.initial;

    expect(ctx.strokeStyle).toBe('white');
    expect(layer.shapes.size).toBe(0);
  });

  it('Adds a shape, renders, and clears', () => {
    let {ctx} = canvasAPI.layers.initial;
    let layer = canvasAPI.layers.initial;

    let x = 15;
    let y = 10;
    let width = 100;
    let height = 50;
    expect(layer.shapes.size).toBe(0);
    canvasAPI.addRect({
      id: 'rect',
      x,
      y,
      width,
      height
    });
    expect(layer.shapes.size).toBe(1);
    canvasAPI.draw();

    expect(ctx.clearRect.mock.calls[0]).toEqual([0, 0, canvasWidth, canvasHeight]);
    expect(ctx.rect.mock.calls[0]).toEqual([x, y, width, height]);

    canvasAPI.clear();
    expect(layer.shapes.size).toBe(0);
  });

  it('Adds a circle, renders  and remove it', () => {
    let {ctx} = canvasAPI.layers.initial;
    let layer = canvasAPI.layers.initial;
    let x = 15;
    let y = 10;
    let width = 100;
    let height = 50;
    let radius = 500;
    expect(layer.shapes.size).toBe(0);
    canvasAPI.addCircle({
      id: 'circle',
      x,
      y,
      radius
    });
    canvasAPI.addCircle({
      id: 'yellowCircle',
      x,
      y,
      radius,
      fillColor: 'yellow'
    });
    expect(layer.shapes.size).toBe(2);
    canvasAPI.draw();

    expect(ctx.arc.mock.calls[0]).toEqual([x, y, radius, 0, Math.PI * 2]);
    expect(ctx.fill.mock.calls[0]).toBeDefined();
    canvasAPI.remove('circle');
    expect(layer.shapes.size).toBe(1);
  });

  it('write a text', () => {
    let {ctx} = canvasAPI.layers.initial;
    let layer = canvasAPI.layers.initial;
    let x = 15;
    let y = 10;
    let width = 100;
    let height = 50;

    expect(layer.shapes.size).toBe(0);
    canvasAPI.write({
      id: 'text',
      text: 'test', // the image to display
      x, y, // pos for x,y..
      textBaseline: 5,
      fillStyle: 'white'
    });
    expect(layer.shapes.size).toBe(1);
    canvasAPI.draw();

    expect(ctx.fillText.mock.calls[0]).toEqual(['test', x, y]);

    canvasAPI.remove('text');
    expect(layer.shapes.size).toBe(0);
  });

  it('Sets and get pan values', () => {
    let {ctx} = canvasAPI.layers.initial;
    let layer = canvasAPI.layers.initial;

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

  it('Adds a circle to a different layer, clearing one layer should not clear the other', () => {
    let {ctx} = canvasAPI.layers.initial;
    let layer = canvasAPI.layers.initial;
    let x = 15;
    let y = 10;
    let radius = 5;

    canvasAPI.addCircle({
      id: 'circle',
      x,
      y,
      radius
    });

    canvasAPI.addLayer('otherLayer');
    canvasAPI.addCircle({
      id: 'circle',
      x,
      y,
      radius,
      layerName: 'otherLayer'
    });
    expect(layer.shapes.size).toBe(1);

    canvasAPI.clear();
    expect(layer.shapes.size).toBe(0);


    expect(canvasAPI.layers.otherLayer.shapes.size).toBe(1);
  });

  it('Can remove a layer once it was added', () => {
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

  it('Adds an arc to the shapes', () => {
    let {ctx} = canvasAPI.layers.initial;
    let layer = canvasAPI.layers.initial;
    let x = 100;
    let y = 100;
    let radius = 500;
    let direction = 1;
    let size = 1;
    let fillColor = 'green';

    canvasAPI.addArc({
      id: 'myArc',
      x,
      y,
      radius,
      direction,
      size,
      fillColor
    });

    expect(layer.shapes.size).toBe(1);
    canvasAPI.draw();
    expect(ctx.arc.mock.calls[0]).toEqual([x, y, radius, (direction - size / 2) * Math.PI, (direction + size / 2) * Math.PI]);
    expect(ctx.fill.mock.calls[0]).toBeDefined();
  });

  it('Adds an arc without FillColor', () => {
    let {ctx} = canvasAPI.layers.initial;
    let layer = canvasAPI.layers.initial;
    let x = 100;
    let y = 100;
    let radius = 500;
    let direction = 1;
    let size = 1;

    canvasAPI.addArc({
      id: 'myArc',
      x,
      y,
      radius,
      direction,
      size
    });

    canvasAPI.draw();
    expect(ctx.arc.mock.calls.length).toBeGreaterThan(0);
    expect(ctx.fill.mock.calls[0]).toBeUndefined();
  });

  it('clear all layers', () => {
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

  it('Writes a bubble text to the canvas', () => {
    canvasAPI.writeBubble({
      id: 'testBubbleText',
      text: 'It is dangerous to go alone! \ntake this!',
      backgroundColor: 'green',
      borderColor: 'orange',
      borderWidth: 0,
      fontColor: 'purple',
      x: 0,
      y: 0,
      height: 0, // the minimum value is the text value within!
      width: 0, // the minimum value is the text value within!
      fontSize: 16,
      paddingLeft:0,
      paddingTop:0,

    });

    // even though 0 height and 0 width were given, the string length and many lines force some size
    let shape = canvasAPI.layers.initial.shapes.get('testBubbleText');
    expect(shape.metaData.height).toBeGreaterThan(0);
    expect(shape.metaData.width).toBe(100);
  });

  it('Writes a bubble text to the canvas - Takes into account paddings for height calculations', () => {
    canvasAPI.writeBubble({
      id: 'testBubbleText',
      text: 'It is dangerous to go alone! \ntake this!',
      backgroundColor: 'green',
      borderColor: 'orange',
      borderWidth: 5,
      fontColor: 'purple',
      x: 0,
      y: 0,
      height: 0, // the minimum value is the text value within!
      width: 0, // the minimum value is the text value within!
      fontSize: 16,
      paddingLeft:50,
      paddingTop:0,
    });

    // even though 0 height and 0 width were given, the string length and many lines force some size
    let shape = canvasAPI.layers.initial.shapes.get('testBubbleText');
    expect(shape.metaData.height).toBeGreaterThan(0);
    expect(shape.metaData.width).toBe(205); // + padding * 2 + border + 100 from mock measureText
  });

  it('Works without missing defaultive arguments', () => {
    canvasAPI.writeBubble({
      id: 'testBubbleText',
      text: 'It is dangerous to go alone! \ntake this!',
      backgroundColor: 'green',
      borderColor: 'orange',
      borderWidth: 5,
      fontColor: 'purple',
      x: 0,
      y: 0,
      height: 0, // the minimum value is the text value within!
      width: 0, // the minimum value is the text value within!
    });

    // even though 0 height and 0 width were given, the string length and many lines force some size
    let shape = canvasAPI.layers.initial.shapes.get('testBubbleText');
    expect(shape.metaData.height).toBeGreaterThan(0);
    expect(shape.metaData.width).toBe(125); // + padding(default 10) * 2 + border + 100 from mock measureText
  });
});