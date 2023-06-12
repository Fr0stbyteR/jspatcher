
import { BasePin } from "./types";

export function compatibleBus(pins: BasePin[]) {
    // idk they're all complicated and I don't know what they mean
    return false;
}

export function compatibleDigital(pins: BasePin[]) {
    // TODO -- this isn't completely correct, since GPIO pins can have
    // input AND output, and the direction might be ambiguous
    let num_outputs = pins.map(p => p.digitalOutput).filter(p => p).length;

    if (num_outputs > 1) {
        return false;
    }

    let output_index = pins.findIndex(p => p.digitalOutput);

    // If not all the rest of the pins are inputs, these cannot be compatible
    if (!pins.filter((p, i) => i != output_index).every(p => p.digitalInput || p.tie)) {
        return false;
    }

    // otherwise, simple digital connections should be compatible
    return true;
}

export function compatibleAnalog(pins: BasePin[]) {
    let num_outputs = pins.map(p => p.analogOutput).filter(p => p).length;

    if (num_outputs > 1) {
        return false;
    }

    let output_index = pins.findIndex(p => p.analogOutput);

    // If not all the rest of the pins are inputs, these cannot be compatible
    if (!pins.filter((p, i) => i != output_index).every(p => p.analogInput || p.tie)) {
        return false;
    }

    // otherwise, simple analog connections should be compatible
    return true;
}

export function compatiblePins(pins: BasePin[]) {

    let compatibilities = [
        compatibleBus,
        compatibleDigital,
        compatibleAnalog,
    ];

    // If any of the compatibilities are true, then the pins are compatible
    // TODO -- this should probably return exactly which aspects are compatible
    if (compatibilities.some(f => f(pins))) {
        return true;
    }

    return false;
}
