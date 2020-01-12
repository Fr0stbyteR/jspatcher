import { CanvasUI } from "../BaseUI";
import { BaseAudioObject } from "../Base";

export interface OscilloscopeUIState {
    frameRate: number;
    estimatedFreq: number;
    stablize: number;
    $cursor: number;
    zoom: number;
    zoomOffset: number;
    range: number;
    autoRange: boolean;
    bgColor: string;
    phosphorColor: string;
    textColor: string;
    gridColor: string;
}
export class OscilloscopeUI extends CanvasUI<Oscilloscope, {}, OscilloscopeUIState> {
    paint() {

    }
}
export class Oscilloscope extends BaseAudioObject {

}
