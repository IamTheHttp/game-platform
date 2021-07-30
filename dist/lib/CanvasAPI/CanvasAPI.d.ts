/**
 * Library for working with Canvas,
 * Works by using a 2D context as an argument
 * Provides abstraction for some common shapes in Canvas
 */
import { ILayers, IRect, IWriteToCanvas, IPanOffset, ICircle, IArc, IWriteTextBubble } from '../interfaces';
declare class CanvasAPI {
    layers: ILayers;
    defaultStrokeStyle: string;
    panX: number;
    panY: number;
    constructor(ctx: any, strokeStyle?: string);
    addLayer(name: any): void;
    removeLayer(name: any): void;
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
    remove(id: any, layerName?: string): void;
    addImage({ id, image, // the image to display
    x, y, // pos for x,y..
    height, width, cropStartX, cropStartY, cropSizeX, cropSizeY, rotation, // in radians
    layerName }: {
        id: any;
        image: any;
        x: any;
        y: any;
        height: any;
        width: any;
        cropStartX: any;
        cropStartY: any;
        cropSizeX: any;
        cropSizeY: any;
        rotation: any;
        layerName?: string;
    }): void;
    addShape({ id, drawFn, layerName }: {
        id: any;
        drawFn: any;
        layerName?: string;
    }): void;
    writeBubble({ id, text, backgroundColor, borderColor, borderWidth, fontSize, fontColor, x, y, fontFace, height, width, paddingLeft, paddingTop, layerName }: IWriteTextBubble): void;
    addRect({ id, x, y, width, height, strokeStyle, lineWidth, fillColor, layerName }: IRect): void;
    addArc({ id, direction, size, color, fillColor, lineWidth, x, y, radius, layerName }: IArc): void;
    addCircle({ id, x, y, radius, lineWidth, color, fillColor, layerName }: ICircle): void;
    /**
     * Method allows us to pan around the canvas
     */
    pan(x: any, y: any): void;
    getPan(): IPanOffset;
    write({ id, text, x, y, font, textBaseline, fillStyle, strokeStyle, layerName }: IWriteToCanvas): void;
    draw(layerName?: string): void;
}
export default CanvasAPI;
