export class Shapes {
  draw: () => void;
  metaData: {
    [key: string]: any
  };

  constructor(draw: () => void, metaData = {}) {
    this.draw = draw;
    this.metaData = metaData;
  }
}

interface ICircleMetaData {
  id: string;
  x: number;
  y: number;
  radius: number;
  type:string;
  [other: string]: any;
}

export class Circle extends Shapes {
  metaData: ICircleMetaData;
  id:string;
  x:number;
  y:number;
  radius:number;
  lineWidth:number;
  fillColor:string;
  color:string;
  ctx: CanvasRenderingContext2D;

  constructor(id: string, x: number, y: number, radius: number, lineWidth:number , fillColor: string, color:string, ctx:CanvasRenderingContext2D) {
    let shapeMetaData = {id, x, y, radius, type:'circle'};

    super(() => this._draw(), shapeMetaData);

    this.metaData = shapeMetaData;
    this.id = id;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.lineWidth = lineWidth;
    this.fillColor = fillColor;
    this.color = color;
  }

  _draw() {
    let {ctx, lineWidth, x, y, radius, fillColor, color} = this;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.moveTo(x, y);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

    ctx.stroke();
    ctx.closePath();
  }
}