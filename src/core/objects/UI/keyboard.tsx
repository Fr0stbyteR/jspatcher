import * as React from "react";
import { BaseUI, BaseUIState } from "../BaseUI";
import UIObject from "./Base";
import { TMIDIEvent, TMeta, TPropsMeta } from "../../types";
import { isMIDIEvent } from "../../../utils/utils";

type KeyMap = number[];
interface KeyboardState {
    keys: KeyMap;
    selected: number;
}
interface KeyboardUIProps {
    from: number;
    to: number;
    blackKeyColor: string;
    whiteKeyColor: string;
    selectedColor: string;
    keyOnColor: string;
    mode: "mono" | "poly" | "touch";
}
interface KeyboardUIState extends KeyboardState, BaseUIState, KeyboardUIProps {}

export class KeyboardUI<T extends keyboard> extends BaseUI<T, {}, KeyboardUIState> {
    static sizing = "both" as const;
    static defaultSize: [number, number] = [450, 60];
    static blacks = [1, 3, 6, 8, 10];
    state: KeyboardUIState = { ...this.state, keys: this.object.state.keys, selected: undefined };
    isBlack(key: number) {
        return KeyboardUI.blacks.indexOf(key % 12) !== -1;
    }
    get from() {
        if (this.isBlack(this.state.from)) return this.state.from - 1;
        return this.state.from;
    }
    get to() {
        if (this.isBlack(this.state.to)) return this.state.to + 1;
        return this.state.to;
    }
    get whiteCount() {
        const { to } = this;
        let { from } = this;
        if (from >= to) return 0;
        let count = 0;
        while (from <= to) {
            if (!this.isBlack(from++)) count++;
        }
        return count;
    }
    inTouch = false;
    handleMouseDownKey = (e: React.MouseEvent<SVGRectElement>, key: number) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.pageY - rect.top;
        const height = rect.height;
        const velocity = (Math.min(127, ~~(y / height * 128)) || 1);
        this.object.keyTrigger(key, velocity);
        this.inTouch = true;
        const handleMouseUp = () => {
            this.inTouch = false;
            if (this.state.mode === "touch") {
                this.object.flush();
                this.setState(this.object.state);
            }
            this.setState({ selected: undefined });
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mouseup", handleMouseUp);
    };
    handleMouseEnterKey = (e: React.MouseEvent<SVGRectElement>, key: number) => {
        if (!this.inTouch) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.pageY - rect.top;
        const height = rect.height;
        const velocity = (Math.min(127, ~~(y / height * 128)) || 1);
        this.object.keyTrigger(key, velocity);
    };
    render() {
        const { from, to, whiteCount, state } = this;
        const { blackKeyColor, whiteKeyColor, keyOnColor, selectedColor, selected } = state;
        const whites: JSX.Element[] = [];
        const blacks: JSX.Element[] = [];
        const whiteSplits: JSX.Element[] = [];
        const blackStyle = { fill: blackKeyColor, strokeWidth: 0 };
        const whiteStyle = { fill: whiteKeyColor, strokeWidth: 0 };
        const keyOnStyle = { fill: keyOnColor, strokeWidth: 1, stroke: "black" };
        const selectedStyle = { fill: selectedColor, strokeWidth: 1, stroke: "black" };
        const whiteWidthPercentage = 100 / whiteCount;
        const blackWidthPercentage = 100 / whiteCount * 2 / 3;
        const whiteWidth = `${whiteWidthPercentage}%`;
        const blackWidth = `${blackWidthPercentage}%`;
        let $white = 0;
        let key = from;
        while (key <= to) {
            const $key = key;
            const keyOn = +!!this.state.keys[$key];
            if (this.isBlack(key)) {
                const style = key === selected ? selectedStyle : keyOn ? keyOnStyle : blackStyle;
                const x = `${($white - 1 / 3) * whiteWidthPercentage}%`;
                blacks.push(<rect key={$key} x={x} y={0} width={blackWidth} height="70%" style={style} onMouseDown={e => this.handleMouseDownKey(e, $key)} onMouseEnter={e => this.handleMouseEnterKey(e, $key)} />);
            } else {
                const style = key === selected ? selectedStyle : keyOn ? keyOnStyle : whiteStyle;
                const x = `${$white * whiteWidthPercentage}%`;
                whites.push(<rect key={$key} x={x} y={0} width={whiteWidth} height="100%" style={style} onMouseDown={e => this.handleMouseDownKey(e, $key)} onMouseEnter={e => this.handleMouseEnterKey(e, $key)} />);
                if ($white) whiteSplits.push(<line key={$key} x1={x} y1={this.isBlack($key - 1) ? "70%" : 0} x2={x} y2="100%" stroke="black" />);
                $white++;
            }
            key++;
        }
        return (
            <svg width="100%" height="100%">
                <rect x={0} y={0} width="100%" height="100%" style={{ fill: "transparent", strokeWidth: 2, stroke: "black" }} />
                {whiteSplits}
                {whites}
                {blacks}
            </svg>
        );
    }
}
export default class keyboard extends UIObject<{}, KeyboardState, [TMIDIEvent, TMIDIEvent], [Uint8Array & { length: 3 }], [], KeyboardUIProps, KeyboardUIProps & KeyboardState> {
    static description = "Keyboard";
    static inlets: TMeta["inlets"] = [{
        type: "object",
        isHot: true,
        description: "Display & output same MIDI event"
    }, {
        type: "object",
        isHot: true,
        description: "Display without output"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "object",
        description: "MIDI event triggered"
    }];
    static props: TPropsMeta<KeyboardUIProps> = {
        from: {
            type: "number",
            default: 24,
            description: "Lowest MIDI key to display",
            isUIState: true
        },
        to: {
            type: "number",
            default: 96,
            description: "Highest MIDI key to display",
            isUIState: true
        },
        blackKeyColor: {
            type: "color",
            default: "black",
            description: "Display color of black key",
            isUIState: true
        },
        whiteKeyColor: {
            type: "color",
            default: "white",
            description: "Display color of white key",
            isUIState: true
        },
        keyOnColor: {
            type: "color",
            default: "grey",
            description: "Display color of pressed key",
            isUIState: true
        },
        selectedColor: {
            type: "color",
            default: "yellow",
            description: "Display color of selected key",
            isUIState: true
        },
        mode: {
            type: "enum",
            enums: ["mono", "poly", "touch"],
            default: "poly",
            description: "Triggering mode",
            isUIState: true
        }
    };
    static ui = KeyboardUI;
    state: KeyboardState = { keys: this.flushed, selected: undefined };
    get flushed() {
        const keys: KeyMap = [];
        for (let i = 0; i < 128; i++) {
            keys[i] = 0;
        }
        return keys;
    }
    flush(noOutput?: boolean) {
        const { keys } = this.state;
        for (let $key = 0; $key < 128; $key++) {
            if (keys[$key]) {
                this.outlet(0, new Uint8Array([9 << 4, $key, 0]) as Uint8Array & { length: 3 });
                this.state.keys[$key] = 0;
            }
        }
        this.state.selected = undefined;
    }
    keyTrigger(keyIn: number, velocityIn: number, noOutput?: boolean) {
        const key = Math.max(0, Math.min(127, ~~+keyIn));
        const velocity = Math.max(0, Math.min(127, ~~+velocityIn));
        const mode = this.getProp("mode");
        if (mode === "mono") {
            const keys = this.flushed;
            keys[key] = velocity;
            if (!noOutput) this.outlet(0, new Uint8Array([9 << 4, key, velocity]) as Uint8Array & { length: 3 });
            this.setState({ keys, selected: key });
        } else if (mode === "poly") {
            const { keys } = this.state;
            const v = +!keys[key] * (velocity || 1);
            keys[key] = v;
            if (!noOutput) this.outlet(0, new Uint8Array([9 << 4, key, v]) as Uint8Array & { length: 3 });
            this.setState({ keys: { ...keys }, selected: v ? key : undefined });
        } else {
            const { keys } = this.state;
            this.flush(noOutput);
            keys[key] = velocity;
            if (!noOutput && velocity) this.outlet(0, new Uint8Array([9 << 4, key, velocity]) as Uint8Array & { length: 3 });
            this.setState({ keys: { ...keys }, selected: velocity ? key : undefined });
        }
        this.updateUI(this.state);
    }
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 1;
        });
        let prevMode: KeyboardUIProps["mode"];
        this.on("postInit", () => prevMode = this.getProp("mode"));
        this.on("updateProps", () => {
            if (prevMode !== this.getProp("mode")) {
                this.flush();
                this.setState({ keys: { ...this.state.keys }, selected: undefined });
                this.updateUI(this.state);
            }
        });
        this.on("inlet", ({ data, inlet }) => {
            if (isMIDIEvent(data)) {
                const cmd = data[0] >> 4;
                const channel = data[0] & 0xf;
                const data1 = data[1];
                const data2 = data[2];
                if (channel === 9) return;
                if (cmd === 8 || (cmd === 9 && data2 === 0)) this.keyTrigger(data1, 0, inlet === 1);
                else if (cmd === 9) this.keyTrigger(data1, data2, inlet === 1);
            }
        });
    }
}
