import Entity from "./ECS/Entity";
import {Shape} from "./PainterAPI/Shapes/Shape";
import {MouseEvent} from "react";
import Group from "./ECS/Group";

export interface IEntityMap<T > {
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
  shapes: Map<string, Shape>
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
  color?: string, // alias to strokeStyle
  strokeStyle?:string; // alias to color
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
  color?: string, // alias to strokeStyle
  strokeStyle?:string; // alias to color
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
  color?: string,       // alias to color
  strokeStyle?: string; // alias to color
  fillColor?: string,
  layerName?:string
}

export interface IRect {
  id: string,
  x: number,
  y:number,
  width:number,
  height: number,
  color?: string,       // alias to color
  strokeStyle?: string; // alias to color
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
  onMiniMapClick?: (e: MouseEvent<HTMLCanvasElement>) => void,
  onMiniMapMove?: (e: MouseEvent<HTMLCanvasElement>) => void,
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
  hits: IHit[];
}

export interface IHit {
  id: string,
  layerName: string
}


export interface IAddImageData {
  id: string,
  image: CanvasImageSource, // the image to display
  x:number, y:number, // pos for x,y..
  height:number, width:number,
  cropStartX:number, cropStartY:number, cropSizeX:number, cropSizeY:number,
  rotation:number, // in radians
  layerName?: string
}

export type IShapes = Map<string, Shape>;

export interface IMouseClickInterface {
  hits: IHit[];
  dbClick: boolean;
  isMouseDown: boolean;
  // Information about the currently selected area (when you select an area with your mouse)
  // if mouse is not held down(no selection), these numbers will be set to 0
  selectedBox: ISelectedBoxData

}

export type IEmptyGroup = Partial<Group>