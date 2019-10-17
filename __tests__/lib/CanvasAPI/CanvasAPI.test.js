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
      radius
    }, 'otherLayer');
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
      radius: 5
    }, 'otherLayer');
    canvasAPI.removeLayer('otherLayer');
    
    expect(canvasAPI.layers.otherLayer).toBeFalsy();
  });
});