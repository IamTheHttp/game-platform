export declare class Shapes {
    draw: () => void;
    metaData: {
        [key: string]: any;
    };
    constructor(draw: any, metaData?: {});
}
interface ICircleMetaData {
    id: string;
    x: number;
    y: number;
    radius: number;
    type: string;
    [other: string]: any;
}
export declare class Circle extends Shapes {
    metaData: ICircleMetaData;
    id: string;
    x: number;
    y: number;
    radius: number;
    lineWidth: number;
    fillColor: string;
    color: string;
    ctx: CanvasRenderingContext2D;
    constructor(id: string, x: number, y: number, radius: number, lineWidth: number, fillColor: string, color: string, ctx: CanvasRenderingContext2D);
    _draw(): void;
}
export {};
