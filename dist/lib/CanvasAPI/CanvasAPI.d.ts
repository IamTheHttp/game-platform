/**
 * Library for working with Canvas,
 * Works by using a 2D context as an argument
 * Provides abstraction for some common shapes in Canvas
 */
import { Shape } from "./Shapes/Shape";
import { ILayers, IRect, IWriteToCanvas, IPanOffset, ICircle, IArc, IWriteTextBubble, IAddImageData } from '../interfaces';
declare class CanvasAPI {
    layers: ILayers;
    defaultStrokeStyle: string;
    panX: number;
    panY: number;
    constructor(ctx: CanvasRenderingContext2D, strokeStyle?: string);
    addLayer(name: string): void;
    removeLayer(name: string): void;
    /**
     * Clears all the shapes
     */
    clear(layerName?: string): void;
    clearAllLayers(): void;
    /**
     * Removes a shape by its ID
     * @param id
     * @param layerName
     */
    remove(id: string, layerName?: string): void;
    addImage({ id, image, // the image to display
    x, y, // pos for x,y..
    height, width, cropStartX, cropStartY, cropSizeX, cropSizeY, rotation, // in radians
    layerName }: IAddImageData): void;
    addShape({ id, render, layerName }: Shape): void;
    writeBubble({ id, text, backgroundColor, borderColor, borderWidth, fontSize, fontColor, x, y, fontFace, height, width, paddingLeft, paddingTop, layerName }: IWriteTextBubble): void;
    addRect({ id, x, y, width, height, strokeStyle, lineWidth, fillColor, layerName }: IRect): void;
    addArc({ id, direction, size, color, fillColor, lineWidth, x, y, radius, layerName }: IArc): void;
    addCircle({ id, x, y, radius, lineWidth, color, fillColor, layerName }: ICircle): void;
    /**
     * Method allows us to pan around the canvas
     */
    pan(x: number, y: number): void;
    getPan(): IPanOffset;
    write({ id, text, x, y, font, textBaseline, fillStyle, strokeStyle, layerName }: IWriteToCanvas): void;
    draw(layerName?: string): void;
}
export default CanvasAPI;
