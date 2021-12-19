import SelectedBox from './SelectedBox/SelectedBox';
import { IViewClickInfo, IViewMoveInfo, IGameCanvasOptions, IClientViewCoordinates } from "../interfaces";
import { Painter } from "../PainterAPI/Painter";
/**
 * This class is responsible for hooking the canvas events to the PainterAPI.
 */
declare class GameCanvas {
    selectedBoxColor: string;
    mapHeight: number;
    mapWidth: number;
    viewHeight: number;
    viewWidth: number;
    onViewMapClick: (arg: IViewClickInfo) => void;
    onViewMapMove: (arg: IViewMoveInfo) => void;
    onMiniMapClick: (e: MouseEventInit | TouchEventInit) => void;
    onMiniMapMove: (e: MouseEventInit | TouchEventInit) => void;
    enableSelectBox: boolean;
    lastClick: number;
    dbClick: boolean;
    dbTap: boolean;
    lastTap: number;
    selectedBox: SelectedBox;
    isMouseDown: boolean;
    mapAPI: Painter;
    miniMapAPI: Painter;
    lastKnownPositionInCanvasTermsX: number;
    lastKnownPositionInCanvasTermsY: number;
    viewMapCanvas: HTMLCanvasElement;
    miniMapCanvas: HTMLCanvasElement;
    miniMapX: number;
    miniMapY: number;
    constructor(options: IGameCanvasOptions);
    /**
     * @desc - Gets the x,y position inside the canvas based on a mouse event with clientX and clientY
     *         Will return X,Y values in relative terms to the painted Canvas dimensions and includes panning
     * @param clientInputCoordinates
     * @param canvas
     * @param PainterAPI
     */
    getCursorPositionInCanvasTerms(clientInputCoordinates: IClientViewCoordinates, canvas: HTMLCanvasElement, PainterAPI: Painter): {
        x: number;
        y: number;
    };
    handleMapMouseMove(): void;
    handleMapMouseLeave(): void;
    handleMapTouchEnd(): void;
    handleMapMouseUp(): void;
    updateViewMapCursorPosition(inputCoordinates: IClientViewCoordinates): IClientViewCoordinates;
    updateMiniMapCursorPosition(inputCoordinates: IClientViewCoordinates): void;
    handleMiniMapMove(event: MouseEventInit): void;
    handleMiniMapClick(event: MouseEventInit | TouchEventInit): void;
    updateMiniMapSquare(): void;
    handleMapMouseDown(): void;
    setSelectBox(): void;
    handleTouchStart(e: TouchEvent): void;
    handleMiniMapTouchStart(e: TouchEventInit): void;
    ensureNegative(a: number): number;
    handleTouchMove(e: TouchEvent): void;
    registerCanvasPair(mainMapCanvas: HTMLCanvasElement, miniMapCanvas: HTMLCanvasElement): {
        map: Painter;
        minimap: Painter;
    };
    registerMinimapCanvas(canvas: HTMLCanvasElement): Painter;
    registerMapCanvas(canvas: HTMLCanvasElement): Painter;
}
export default GameCanvas;
