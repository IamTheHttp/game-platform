export declare class Shape {
    id?: string;
    layerName?: string;
    metaData?: {
        [key: string]: any;
    };
    render: (ctx: CanvasRenderingContext2D) => void;
    constructor(renderFn: (ctx: CanvasRenderingContext2D) => void, metaData?: {});
}
interface ICircleMetaData {
    id: string;
    x: number;
    y: number;
    radius: number;
    type: string;
    [other: string]: any;
}
export declare class Circle extends Shape {
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
    _render(): void;
}
export {};
