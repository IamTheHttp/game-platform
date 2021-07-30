import { ISelectedBoxData, ICoordinates } from "../../interfaces";
/**
 * Class that represents the current selected area by the user
 * Populated when the user click, holds and move the mouse
 */
declare class SelectedBox {
    start: ICoordinates;
    end: ICoordinates;
    constructor();
    reset(): void;
    getData(): ISelectedBoxData;
    getHeight(): number;
    getWidth(): number;
    setStart(x: any, y: any): void;
    setEnd(x: any, y: any): void;
}
export default SelectedBox;
