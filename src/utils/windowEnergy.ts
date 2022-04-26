/*
import * as WindowFunction from "window-function";
import apply from "window-function/apply";
import { TWindowFunction } from "../core/types";

const t1 = performance.now();
const types = Object.keys(WindowFunction) as TWindowFunction[];
const windowEnergyFactor1 = {} as Record<TWindowFunction, number>;
for (const type of types) {
    const length = 2 ** 16;
    const input = new Float64Array(length);
    input.fill(1);
    const output = apply(input, WindowFunction[type]);
    let sum = 0;
    for (let i = 0; i < output.length; i++) {
        sum += output[i];
    }
    sum /= length;
    windowEnergyFactor1[type] = 1 / sum;
}
const t2 = performance.now();
console.log(windowEnergyFactor1, t2 - t1);
export default windowEnergyFactor1;
*/

const windowEnergyFactor = {
    bartlett: 2,
    bartlettHann: 2,
    blackman: 2.3809887119568915,
    blackmanHarris: 2.7874989727382036,
    blackmanNuttall: 2.750453869665869,
    cosine: 1.570820295911242,
    exactBlackman: 2.3442064112098633,
    flatTop: 1,
    hamming: 1.851875922956815,
    hann: 2,
    lanczos: 1.6964078710296637,
    nuttall: 2.810863425102577,
    rectangular: 1,
    triangular: 2,
    welch: 1.5
};
export default windowEnergyFactor;
