import { IHit, ISelectedBoxData, IShapes } from "../../interfaces";
declare function getShapesInSelectionBox(shapes: IShapes, layerName: string, selectedData: ISelectedBoxData): IHit[];
export default getShapesInSelectionBox;
