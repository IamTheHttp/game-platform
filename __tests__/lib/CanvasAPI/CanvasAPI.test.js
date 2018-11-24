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
      canvas: {
        width: canvasWidth,
        height: canvasHeight
      }
    });
  });

  it('inits CanvasAPI', () => {
    expect(canvasAPI.ctx.strokeStyle).toBe('white');
    expect(canvasAPI.shapes.size).toBe(0);
  });

  it('Adds a shape, renders, and clears', () => {
    let x = 15;
    let y = 10;
    let width = 100;
    let height = 50;
    expect(canvasAPI.shapes.size).toBe(0);
    canvasAPI.addRect({
      id: 'rect',
      x,
      y,
      width,
      height
    });
    expect(canvasAPI.shapes.size).toBe(1);
    canvasAPI.draw();

    expect(canvasAPI.ctx.clearRect.mock.calls[0]).toEqual([0, 0, canvasWidth, canvasHeight]);
    expect(canvasAPI.ctx.rect.mock.calls[0]).toEqual([x, y, width, height]);

    canvasAPI.clear();
    expect(canvasAPI.shapes.size).toBe(0);
  });

  it('Adds a circle, renders  and remove it', () => {
    let x = 15;
    let y = 10;
    let width = 100;
    let height = 50;
    let radius = 500;
    expect(canvasAPI.shapes.size).toBe(0);
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
    expect(canvasAPI.shapes.size).toBe(2);
    canvasAPI.draw();

    expect(canvasAPI.ctx.arc.mock.calls[0]).toEqual([x, y, radius, 0, Math.PI * 2]);
    expect(canvasAPI.ctx.fill.mock.calls[0]).toBeDefined();
    canvasAPI.remove('circle');
    expect(canvasAPI.shapes.size).toBe(1);
  });

  it('write a text', () => {
    let x = 15;
    let y = 10;
    let width = 100;
    let height = 50;

    expect(canvasAPI.shapes.size).toBe(0);
    canvasAPI.write({
      id: 'text',
      text: 'test', // the image to display
      x, y, // pos for x,y..
      textBaseline: 5,
      fillStyle: 'white'
    });
    expect(canvasAPI.shapes.size).toBe(1);
    canvasAPI.draw();

    expect(canvasAPI.ctx.fillText.mock.calls[0]).toEqual(['test', x, y]);

    canvasAPI.remove('text');
    expect(canvasAPI.shapes.size).toBe(0);
  });

  it('Sets and get pan values', () => {
    expect(canvasAPI.getPan()).toEqual({
      panX: 0,
      panY: 0
    });

    canvasAPI.pan(100, 100);
    expect(canvasAPI.ctx.setTransform.mock.calls[0]).toEqual([1, 0, 0, 1, 100, 100]);

    expect(canvasAPI.getPan()).toEqual({
      panX: 100,
      panY: 100
    });
  });
});