import * as React from 'react';
import SelectedBox from './SelectedBox/SelectedBox';
import { IViewClickInfo, IViewMoveInfo, IGameCanvasOptions, IClientViewCoordinates } from "../interfaces";
import CanvasAPI from "../CanvasAPI/CanvasAPI";
import { MouseEvent, ReactElement, TouchEvent } from "react";
declare class GameCanvas {
    selectedBoxColor: string;
    mapHeight: number;
    mapWidth: number;
    viewHeight: number;
    viewWidth: number;
    onViewMapClick: (arg: IViewClickInfo) => void;
    onViewMapMove: (arg: IViewMoveInfo) => void;
    onMiniMapClick: (e: MouseEvent | TouchEvent) => void;
    onMiniMapMove: (e: MouseEvent | TouchEvent) => void;
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
    handleMapMouseMove(): void;
    handleMapMouseLeave(): void;
    handleMapTouchEnd(): void;
    handleMapMouseUp(): void;
    updateViewMapCursorPosition(inputCoordinates: IClientViewCoordinates): IClientViewCoordinates;
    updateMiniMapCursorPosition(inputCoordinates: IClientViewCoordinates): void;
    getNewCanvasPairs({ getMapRef, getMiniRef }: {
        getMapRef: (a: CanvasAPI) => void;
        getMiniRef: (a: CanvasAPI) => void;
    }): {
        map: React.ReactElement<HTMLCanvasElement, string | React.JSXElementConstructor<any>>;
        minimap: React.ReactElement<HTMLCanvasElement, string | React.JSXElementConstructor<any>>;
    };
    handleMiniMapMove(event: MouseEvent<HTMLCanvasElement>): void;
    handleMiniMapClick(event: MouseEvent | TouchEvent): void;
    updateMiniMapSquare(): void;
    handleMapMouseDown(): void;
    setSelectBox(): void;
    handleTouchStart(e: TouchEvent): void;
    handleMiniMapTouchStart(e: TouchEvent): void;
    ensureNegative(a: number): number;
    handleTouchMove(e: TouchEvent): void;
    generateMapCanvas(getRef: (a: CanvasAPI, b: HTMLCanvasElement) => void): ReactElement<HTMLCanvasElement>;
    generateMiniMapCanvas(getRef: (a: CanvasAPI, b: HTMLCanvasElement) => void): ReactElement<HTMLCanvasElement>;
}
export default GameCanvas;
