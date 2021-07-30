import Entity from "./ECS/Entity";
import {Shapes} from "./CanvasAPI/Shapes/Shapes";

export interface IEntityMap<T extends Entity> {
  [key: number]: T
}

export interface IComponent {
  name: string;
}


export interface ILayers {
  [key: string] : ILayer
}

export interface TMP {
  panX: number;
  panY: number;
}

export interface ILayer {
  ctx: CanvasRenderingContext2D,
  shapes: Map<string, Shapes>
}

export interface IPanOffset {
  panX : number;
  panY: number;
}

export interface IWriteToCanvas {
  id: string,
  text: string,
  x: number,
  y:number,
  font?:string,
  textBaseline: CanvasTextBaseline,
  fillStyle: string,
  strokeStyle?:string,
  layerName?:string
}

export interface IWriteTextBubble {
  id: string,
  text: string,
  x: number,
  y:number,
  font?:string,
  textBaseline?: CanvasTextBaseline,
  fillStyle?: string,
  strokeStyle?:string,
  backgroundColor:string,
  borderColor: string,
  borderWidth: number,
  fontSize?: number,
  fontColor: string,
  fontFace?: string,
  height: number,
  width:number,
  paddingLeft?:number;
  paddingTop?:number;
  layerName?: string;
}

export interface IArc {
  id: string,
  x: number,
  y:number,
  radius: number,
  direction: number,
  size: number
  color?: string,
  lineWidth?: number,
  fillColor?: string,
  layerName?:string
}


export interface ICircle {
  id: string,
  x: number,
  y:number,
  radius:number,
  lineWidth?: number,
  color?: string,
  fillColor?: string,
  layerName?:string
}

export interface IRect {
  id: string,
  x: number,
  y:number,
  width:number,
  height: number,
  strokeStyle?:string;
  lineWidth?: number,
  fillColor?: string,
  layerName?:string
}

export interface ICoordinates {
  x: number;
  y: number;
}

export interface IClientViewCoordinates extends ICoordinates {

}

export interface IGameCanvasOptions {
  selectedBoxColor?: string,
  mapHeight: number,
  mapWidth: number,
  viewHeight: number,
  viewWidth: number,
  onViewMapClick?: (arg: IViewClickInfo) => void;
  onViewMapMove?: (arg: IViewMoveInfo) => void;
  onMiniMapClick?: (e: MouseEvent) => void,
  onMiniMapMove?: (e: MouseEvent) => void,
  enableSelectBox?: boolean,
}

export interface ISelectedBoxData {
  start : ICoordinates;
  end : ICoordinates;
  width : number;
  height : number;
}


export interface IViewMoveInfo {
  x: number;
  y:number;
  isMouseDown: boolean;
  dbClick: boolean;
  selectedBox: ISelectedBoxData,
}

export interface IViewClickInfo extends IViewMoveInfo{
  hits: Array<{id: string, layerName: string}>
}


export interface IAddImageData {
  id: string,
  image: CanvasImageSource, // the image to display
  x:number, y:number, // pos for x,y..
  height:number, width:number,
  cropStartX:number, cropStartY:number, cropSizeX:number, cropSizeY:number,
  rotation:number, // in radians
  layerName: string
}

export interface IShape {
  id: string, drawFn: (ctx: CanvasRenderingContext2D) => void, layerName: string;
}