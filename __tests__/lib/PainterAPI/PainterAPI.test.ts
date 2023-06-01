/* global describe */
/* global it */
/* global expect */
/* global beforeEach */

import {Painter} from '../../../src/lib/PainterAPI/Painter';

interface Mocked2DContext {
  measureText: (text: 'string') => object;
  font: string;
  save: jest.Mocked<any>;
  setTransform: jest.Mocked<any>;
  clearRect: jest.Mocked<any>;
  restore: jest.Mocked<any>;
  beginPath: jest.Mocked<any>;
  rect: jest.Mocked<any>;
  fillText: jest.Mocked<any>;
  fill: jest.Mocked<any>;
  arc: jest.Mocked<any>;
  stroke: jest.Mocked<any>;
  closePath: jest.Mocked<any>;
  moveTo: jest.Mocked<any>;
  canvas: HTMLCanvasElement;
}

describe('Tests the PainterAPI', () => {
  let PainterAPI: Painter;
  let canvasWidth = 200;
  let canvasHeight = 500;
  beforeEach(() => {
    let parent = document.createElement('div');
    let canvas = document.createElement('canvas');
    parent.appendChild(canvas);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    PainterAPI = new Painter({
      measureText(a: string) {
        return {
          width: 100
        } as TextMetrics;
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
    } as unknown as CanvasRenderingContext2D);
  });

  it('cannot instantiate without ctx', () => {
    expect(() => {
      new Painter(null, null);
    }).toThrow();
  });

  it('inits PainterAPI', () => {
    let {ctx} = PainterAPI.layers.initial;
    let layer = PainterAPI.layers.initial;

    expect(ctx.strokeStyle).toBe('white');
    expect(layer.shapes.size).toBe(0);
  });

  it('Adds a shape, renders, and clears', () => {
    let layer = PainterAPI.layers.initial;
    let ctx = layer.ctx as unknown as Mocked2DContext;

    let x = 15;
    let y = 10;
    let width = 100;
    let height = 50;
    expect(layer.shapes.size).toBe(0);
    PainterAPI.drawRect({
      id: 'rect',
      x,
      y,
      width,
      height
    });
    expect(layer.shapes.size).toBe(1);
    PainterAPI.drawAllShapesInLayer();

    expect(ctx.clearRect.mock.calls[0]).toEqual([0, 0, canvasWidth, canvasHeight]);
    expect(ctx.rect.mock.calls[0]).toEqual([x, y, width, height]);

    PainterAPI.clearAllShapesInLayer();
    expect(layer.shapes.size).toBe(0);
  });

  it('Adds a circle, renders  and remove it', () => {
    let layer = PainterAPI.layers.initial;
    let ctx = layer.ctx as unknown as Mocked2DContext;

    let x = 15;
    let y = 10;
    let radius = 500;
    expect(layer.shapes.size).toBe(0);
    PainterAPI.drawCircle({
      id: 'circle',
      x,
      y,
      radius
    });
    PainterAPI.drawCircle({
      id: 'yellowCircle',
      x,
      y,
      radius,
      fillColor: 'yellow'
    });
    expect(layer.shapes.size).toBe(2);
    PainterAPI.drawAllShapesInLayer();

    expect(ctx.arc.mock.calls[0]).toEqual([x, y, radius, 0, Math.PI * 2]);
    expect(ctx.fill.mock.calls[0]).toBeDefined();
    PainterAPI.removeShapeByID('circle');
    expect(layer.shapes.size).toBe(1);
  });

  it('write a text', () => {
    let layer = PainterAPI.layers.initial;
    let ctx = layer.ctx as unknown as Mocked2DContext;
    let x = 15;
    let y = 10;

    expect(layer.shapes.size).toBe(0);
    PainterAPI.drawText({
      id: 'text',
      text: 'test',
      x,
      y, // pos for x,y..
      textBaseline: 'top',
      fillStyle: 'white'
    });
    expect(layer.shapes.size).toBe(1);
    PainterAPI.drawAllShapesInLayer();

    expect(ctx.fillText.mock.calls[0]).toEqual(['test', x, y]);

    PainterAPI.removeShapeByID('text');
    expect(layer.shapes.size).toBe(0);
  });

  it('Sets and get pan values', () => {
    let layer = PainterAPI.layers.initial;
    let ctx = layer.ctx as unknown as Mocked2DContext;

    expect(PainterAPI.getCurrentPanValue()).toEqual({
      panX: 0,
      panY: 0
    });

    PainterAPI.panCamera(100, 100);
    expect(ctx.setTransform.mock.calls[0]).toEqual([1, 0, 0, 1, 100, 100]);

    expect(PainterAPI.getCurrentPanValue()).toEqual({
      panX: 100,
      panY: 100
    });
  });

  it('Adds a circle to a different layer, clearing one layer should not clear the other', () => {
    let layer = PainterAPI.layers.initial;
    let x = 15;
    let y = 10;
    let radius = 5;

    PainterAPI.drawCircle({
      id: 'circle',
      x,
      y,
      radius
    });

    PainterAPI.addLayer('otherLayer');
    PainterAPI.drawCircle({
      id: 'circle',
      x,
      y,
      radius,
      layerName: 'otherLayer'
    });
    expect(layer.shapes.size).toBe(1);

    PainterAPI.clearAllShapesInLayer();
    expect(layer.shapes.size).toBe(0);

    expect(PainterAPI.layers.otherLayer.shapes.size).toBe(1);
  });

  it('Can remove a layer once it was added', () => {
    PainterAPI.addLayer('otherLayer');
    PainterAPI.drawCircle({
      id: 'circle',
      x: 5,
      y: 5,
      radius: 5,
      layerName: 'otherLayer'
    });
    PainterAPI.removeLayer('otherLayer');

    expect(PainterAPI.layers.otherLayer).toBeFalsy();
  });

  it('Adds an arc to the shapes', () => {
    let layer = PainterAPI.layers.initial;
    let ctx = layer.ctx as unknown as Mocked2DContext;
    let x = 100;
    let y = 100;
    let radius = 500;
    let direction = 1;
    let size = 1;
    let fillColor = 'green';

    PainterAPI.drawArc({
      id: 'myArc',
      x,
      y,
      radius,
      direction,
      size,
      fillColor
    });

    expect(layer.shapes.size).toBe(1);
    PainterAPI.drawAllShapesInLayer();
    expect(ctx.arc.mock.calls[0]).toEqual([
      x,
      y,
      radius,
      (direction - size / 2) * Math.PI,
      (direction + size / 2) * Math.PI
    ]);
    expect(ctx.fill.mock.calls[0]).toBeDefined();
  });

  it('Adds an arc without FillColor', () => {
    let layer = PainterAPI.layers.initial;
    let ctx = layer.ctx as unknown as Mocked2DContext;

    let x = 100;
    let y = 100;
    let radius = 500;
    let direction = 1;
    let size = 1;

    PainterAPI.drawArc({
      id: 'myArc',
      x,
      y,
      radius,
      direction,
      size
    });

    PainterAPI.drawAllShapesInLayer();
    expect(ctx.arc.mock.calls.length).toBeGreaterThan(0);
    expect(ctx.fill.mock.calls[0]).toBeUndefined();
  });

  it('clear all layers', () => {
    PainterAPI.addLayer('otherLayer');
    PainterAPI.addLayer('otherLayer2');

    PainterAPI.drawCircle({
      id: 'circle',
      x: 5,
      y: 5,
      radius: 5,
      layerName: 'otherLayer'
    });

    PainterAPI.drawCircle({
      id: 'circle',
      x: 5,
      y: 5,
      radius: 5,
      layerName: 'otherLayer2'
    });

    expect(PainterAPI.layers.otherLayer.shapes.size).toBeTruthy();
    expect(PainterAPI.layers.otherLayer2.shapes.size).toBeTruthy();

    PainterAPI.clearAllLayers();
    expect(PainterAPI.layers.otherLayer.shapes.size).toBeFalsy();
    expect(PainterAPI.layers.otherLayer2.shapes.size).toBeFalsy();
  });

  it('Writes a bubble text to the canvas', () => {
    PainterAPI.drawTextBubble({
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
      paddingLeft: 0,
      paddingTop: 0
    });

    // even though 0 height and 0 width were given, the string length and many lines force some size
    let shape = PainterAPI.layers.initial.shapes.get('testBubbleText');
    expect(shape.metaData.height).toBeGreaterThan(0);
    expect(shape.metaData.width).toBe(100);
  });

  it('Writes a bubble text to the canvas - Takes into account padding for height calculations', () => {
    PainterAPI.drawTextBubble({
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
      paddingLeft: 50,
      paddingTop: 0
    });

    // even though 0 height and 0 width were given, the string length and many lines force some size
    let shape = PainterAPI.layers.initial.shapes.get('testBubbleText');
    expect(shape.metaData.height).toBeGreaterThan(0);
    expect(shape.metaData.width).toBe(205); // + padding * 2 + border + 100 from mock measureText
  });

  it('Works without missing default arguments', () => {
    PainterAPI.drawTextBubble({
      id: 'testBubbleText',
      text: 'It is dangerous to go alone! \ntake this!',
      backgroundColor: 'green',
      borderColor: 'orange',
      borderWidth: 5,
      fontColor: 'purple',
      x: 0,
      y: 0,
      height: 0, // the minimum value is the text value within!
      width: 0 // the minimum value is the text value within!
    });

    // even though 0 height and 0 width were given, the string length and many lines force some size
    let shape = PainterAPI.layers.initial.shapes.get('testBubbleText');
    expect(shape.metaData.height).toBeGreaterThan(0);
    expect(shape.metaData.width).toBe(125); // + padding(default 10) * 2 + border + 100 from mock measureText
  });
});
