import {ICircle} from "../../interfaces";

export class Shape {
  id?: string;
  layerName?: string = 'initial';
  metaData?: {
    [key: string]: any
  };

  render: (ctx: CanvasRenderingContext2D) => void;

  constructor(renderFn: (ctx: CanvasRenderingContext2D) => void, metaData = {}) {
    this.render = renderFn;
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

export class Circle extends Shape {
  metaData: ICircleMetaData;
  id:string;
  x:number;
  y:number;
  radius:number;
  lineWidth:number;
  fillColor:string;
  color:string;
  ctx: CanvasRenderingContext2D;

  constructor(data: ICircle, ctx:CanvasRenderingContext2D) {
    const {id, x, y, radius, lineWidth, fillColor, color , strokeStyle} = data;

    let shapeMetaData = {id, x, y, radius, type:'circle'};

    super(() => this._render(), shapeMetaData);

    this.metaData = shapeMetaData;
    this.id = id;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.lineWidth = lineWidth;
    this.fillColor = fillColor;
    this.color = color || strokeStyle;
  }

  _render() {
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