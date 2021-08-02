import { IHit, IShapes } from "../../interfaces";
/**
 * Function used for getting all shapes hit from a single click (not from a selection box)
 */
declare function getShapesFromClick(shapes: IShapes, layerName: string, x: number, y: number): IHit[];
export default getShapesFromClick;
