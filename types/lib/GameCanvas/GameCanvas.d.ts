import CanvasAPI from 'lib/CanvasAPI/CanvasAPI';
import SelectedBox from './SelectedBox/SelectedBox';
import { IViewClickInfo, IViewMoveInfo, IGameCanvasOptions } from "../interfaces";
declare class GameCanvas {
    selectedBoxColor: string;
    mapHeight: number;
    mapWidth: number;
    viewHeight: number;
    viewWidth: number;
    onViewMapClick: (arg: IViewClickInfo) => void;
    onViewMapMove: (arg: IViewMoveInfo) => void;
    onMiniMapClick: (e: MouseEvent) => void;
    onMiniMapMove: (e: MouseEvent) => void;
    enableSelectBox: boolean;
    lastClick: number;
    dbClick: boolean;
    dbTap: boolean;
    lastTap: number;
    selectedBox: SelectedBox;
    isMouseDown: boolean;
    mapAPI: CanvasAPI;
    miniMapAPI: CanvasAPI;
    viewMapX: number;
    viewMapY: number;
    viewMapCanvas: HTMLCanvasElement;
    miniMapCanvas: HTMLCanvasElement;
    miniMapX: number;
    miniMapY: number;
    constructor(options: IGameCanvasOptions);
    updateCursorPosition(event: any, canvas: any, canvasAPI: any): {
        x: number;
        y: number;
    };
    handleMapMouseMove(): void;
    handleMapMouseLeave(): void;
    handleMapTouchEnd(): void;
    handleMapMouseUp(): void;
    updateViewMapCursorPosition(event: any): void;
    updateMiniMapCursorPosition(event: any): void;
    getNewCanvasPairs({ getMapRef, getMiniRef }: {
        getMapRef: any;
        getMiniRef: any;
    }): {
        map: any;
        minimap: any;
    };
    handleMiniMapMove(event: MouseEvent): void;
    handleMiniMapClick(event: any): void;
    updateMiniMapSquare(): void;
    handleMapMouseDown(): void;
    setSelectBox(): void;
    handleTouchStart(e: any): void;
    handleMiniMapTouchStart(e: any): void;
    handleTouchMove(e: any): void;
    generateMapCanvas(getRef: (a: CanvasAPI, b: HTMLCanvasElement) => void): any;
    generateMiniMapCanvas(getRef: (a: CanvasAPI, b: HTMLCanvasElement) => void): any;
}
export default GameCanvas;
