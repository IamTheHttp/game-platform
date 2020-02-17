import CanvasAPI from 'lib/CanvasAPI/CanvasAPI';
import SelectedBox from './SelectedBox/SelectedBox';
import { IViewClickInfo, IViewMoveInfo, IGameCanvasOptions, IClientViewCoordinates } from "../interfaces";
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
     * @param canvasAPI
     */
    getCursorPositionInCanvasTerms(clientInputCoordinates: IClientViewCoordinates, canvas: HTMLCanvasElement, canvasAPI: CanvasAPI): {
        x: number;
        y: number;
    };
    private handleMapMouseMove;
    private handleMapMouseLeave;
    private handleMapTouchEnd;
    private handleMapMouseUp;
    updateViewMapCursorPosition(inputCoordinates: IClientViewCoordinates): IClientViewCoordinates;
    updateMiniMapCursorPosition(inputCoordinates: IClientViewCoordinates): void;
    getNewCanvasPairs({ getMapRef, getMiniRef }: {
        getMapRef: (a: CanvasAPI) => void;
        getMiniRef: (a: CanvasAPI) => void;
    }): {
        map: any;
        minimap: any;
    };
    private handleMiniMapMove;
    private handleMiniMapClick;
    updateMiniMapSquare(): void;
    private handleMapMouseDown;
    setSelectBox(): void;
    private handleTouchStart;
    private handleMiniMapTouchStart;
    private ensureNegative;
    private handleTouchMove;
    generateMapCanvas(getRef: (a: CanvasAPI, b: HTMLCanvasElement) => void): any;
    generateMiniMapCanvas(getRef: (a: CanvasAPI, b: HTMLCanvasElement) => void): any;
}
export default GameCanvas;
