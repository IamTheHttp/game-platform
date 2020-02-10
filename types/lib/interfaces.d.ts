import { Shape } from "./CanvasAPI/CanvasAPI";
import Entity from "lib/ECS/Entity";
export interface IEntityMap {
    [key: number]: Entity;
}
export interface IComponent {
    name: string;
}
export interface ILayers {
    [key: string]: ILayer;
}
export interface TMP {
    panX: number;
    panY: number;
}
export interface ILayer {
    ctx: CanvasRenderingContext2D;
    shapes: Map<string, Shape>;
}
export interface IPanOffset {
    panX: number;
    panY: number;
}
export interface IWriteToCanvas {
    id: string;
    text: string;
    x: number;
    y: number;
    font: string;
    textBaseline: CanvasTextBaseline;
    fillStyle: string;
    strokeStyle: string;
    layerName: string;
}
export interface IRect {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    strokeStyle: string;
    lineWidth: number;
    fillColor: string;
    layerName: string;
}
export interface ICoordinates {
    x: number;
    y: number;
}
export interface IGameCanvasOptions {
    selectedBoxColor?: string;
    mapHeight: number;
    mapWidth: number;
    viewHeight: number;
    viewWidth: number;
    onViewMapClick?: (arg?: IViewClickInfo) => void;
    onViewMapMove?: (arg?: IViewMoveInfo) => void;
    onMiniMapClick?: (e: MouseEvent) => void;
    onMiniMapMove?: (e: MouseEvent) => void;
    enableSelectBox?: boolean;
}
export interface ISelectedBoxData {
    start: ICoordinates;
    end: ICoordinates;
    width: number;
    height: number;
}
export interface IViewMoveInfo {
    x: number;
    y: number;
    isMouseDown: boolean;
    dbClick: boolean;
    selectedBox: ISelectedBoxData;
}
export interface IViewClickInfo extends IViewMoveInfo {
    hits: Array<any>;
}
