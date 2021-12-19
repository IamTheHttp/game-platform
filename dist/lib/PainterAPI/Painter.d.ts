/**
 * Library for working with Canvas,
 * Works by using a 2D context as an argument
 * Provides abstraction for some common shapes in Canvas
 */
import { Shape } from "./Shapes/Shape";
import { ILayers, IRect, IWriteToCanvas, IPanOffset, ICircle, IArc, IWriteTextBubble, IAddImageData } from '../interfaces';
export declare class Painter {
    layers: ILayers;
    defaultStrokeStyle: string;
    panX: number;
    panY: number;
    constructor(ctx: CanvasRenderingContext2D, strokeStyle?: string);
    /**
     * Add another layer that can be used for drawAllShapesInLayering.
     * Internally this clones the existing canvas.
     * @param name
     */
    addLayer(name: string): void;
    removeLayer(name: string): void;
    clearAllShapesInLayer(layerName?: string): void;
    clearAllLayers(): void;
    removeShapeByID(id: string, layerName?: string): void;
    drawImage({ id, image, // the image to display
    x, y, // pos for x,y..
    height, width, cropStartX, cropStartY, cropSizeX, cropSizeY, rotation, // in radians
    layerName }: IAddImageData): void;
    addShape({ id, render, layerName }: Shape): void;
    drawTextBubble({ id, text, backgroundColor, borderColor, borderWidth, fontSize, fontColor, x, y, fontFace, height, width, paddingLeft, paddingTop, layerName }: IWriteTextBubble): void;
    drawRect({ id, x, y, width, height, strokeStyle, color, lineWidth, fillColor, layerName }: IRect): void;
    drawArc({ id, direction, size, color, strokeStyle, fillColor, lineWidth, x, y, radius, layerName }: IArc): void;
    drawCircle(circleData: ICircle): void;
    /**
     * Method allows us to pan around the canvas
     */
    panCamera(x: number, y: number): void;
    getCurrentPanValue(): IPanOffset;
    drawText({ id, text, x, y, font, textBaseline, fillStyle, strokeStyle, color, layerName }: IWriteToCanvas): void;
    drawAllShapesInLayer(layerName?: string): void;
}
