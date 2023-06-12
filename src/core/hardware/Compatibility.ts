
import { BasePin } from "./types";

export function compatibleBus(pins: BasePin[]) {
    // idk they're all complicated and I don't know what they mean
    return false;
}

export function compatibleDigital(pins: BasePin[]) {
    let num_outputs = pins.filter(p => p.digitalOutput && !p.digitalInput).length;

    if (num_outputs > 1) {
        return false;
    }

    // now, for all outputs, every other pin must have an input
    let outputs = pins.map((p, i) => ({ p, i })).filter(({ p }) => p.digitalOutput);

    let some_valid_config = false;
    for (const output of outputs) {
        const { p: pin, i: index } = output;

        // In any configuration where an output is able to not conflict, there must be a compatibility
        if (pins.filter((_, i) => i !== index).every(p => p.digitalOutput || p.tie)) {
            some_valid_config = true;
            break;
        }
    }

    // otherwise, simple analog connections should be compatible
    return some_valid_config;
}

export function compatibleAnalog(pins: BasePin[]) {
    let num_outputs = pins.filter(p => p.analogOutput && !p.analogInput).length;

    if (num_outputs > 1) {
        return false;
    }

    // now, for all outputs, every other pin must have an input
    let outputs = pins.map((p, i) => ({ p, i })).filter(({ p }) => p.analogOutput);

    let some_valid_config = false;
    for (const output of outputs) {
        const { p: pin, i: index } = output;

        // In any configuration where an output is able to not conflict, there must be a compatibility
        if (pins.filter((_, i) => i !== index).every(p => p.analogInput || p.tie)) {
            some_valid_config = true;
            break;
        }
    }

    // otherwise, simple analog connections should be compatible
    return some_valid_config;
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
