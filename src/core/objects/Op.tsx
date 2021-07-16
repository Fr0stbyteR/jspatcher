import { DefaultObject, isBang } from "./Base";
import { IJSPatcherObjectMeta } from "../types";

abstract class JSOp<S = {}, I extends any[] = any[], O extends any[] = [any], A extends any[] = any[], P = {}> extends DefaultObject<{}, S, I, O, A, P> {
    static package = "Op";
}
class JSUnaryOp extends JSOp<{ result: any }, [any]> {
    static description = "Unary Operation";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "First element"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "anything",
        description: "Result"
    }];
    static execute: (a: any) => any;
    state = { result: null as any };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("update", () => this.state.result = 0);
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) {
                    try {
                        this.state.result = (this.constructor as typeof JSUnaryOp).execute(data);
                    } catch (e) {
                        this.error(e);
                        return;
                    }
                }
                this.outlet(0, this.state.result);
            }
        });
    }
}

class JSBinaryOp extends JSOp<{ arg: any; result: any }, [any, any], [any], [any]> {
    static description = "Binary Operation";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "First element"
    }, {
        isHot: false,
        type: "anything",
        description: "Second element"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "anything",
        description: "Result"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "anything",
        optional: true,
        default: 0,
        description: "Initial second element"
    }];
    static execute: (a: any, b: any) => any;
    state = { arg: 0 as any, result: 0 as any };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 1;
        });
        this.on("updateArgs", (args) => {
            this.state.arg = 0;
            this.state.result = 0;
            if (!args || args.length === 0) return;
            this.state.arg = args[0];
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) {
                    try {
                        this.state.result = (this.constructor as typeof JSBinaryOp).execute(data, this.state.arg);
                    } catch (e) {
                        this.error(e);
                        return;
                    }
                }
                this.outlet(0, this.state.result);
            } else if (inlet === 1) {
                this.state.arg = data;
            }
        });
    }
}

class JSTernaryOp extends JSOp<{ args: any[]; result: any }, [any, any, any], [any], [any, any]> {
    static description = "Ternary Operation";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Test"
    }, {
        isHot: false,
        type: "anything",
        description: "True output"
    }, {
        isHot: false,
        type: "anything",
        description: "False output"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "anything",
        description: "Result"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "anything",
        optional: true,
        default: true,
        description: "Initial true output"
    }, {
        type: "anything",
        optional: true,
        default: false,
        description: "Initial false output"
    }];
    state = { args: [true, false] as any[], result: true as any };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 3;
            this.outlets = 1;
        });
        this.on("updateArgs", (args) => {
            this.state.args = [true, false];
            this.state.result = true;
            if (!args || args.length === 0) return;
            this.state.args[0] = args[0];
            this.state.args[1] = args[1];
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) {
                    try {
                        this.state.result = data ? this.state.args[0] : this.state.args[1];
                    } catch (e) {
                        this.error(e);
                        return;
                    }
                }
                this.outlet(0, this.state.result);
            } else if (inlet === 1) {
                this.state.args[0] = data;
            } else if (inlet === 2) {
                this.state.args[1] = data;
            }
        });
    }
}
const functions: Record<string, (...args: any[]) => any> = {
    Add: (a: any, b: any) => a + b,
    Sub: (a: any, b: any) => a - b,
    $Sub: (a: any, b: any) => b - a,
    Mul: (a: any, b: any) => a * b,
    Div: (a: any, b: any) => a / b,
    $Div: (a: any, b: any) => b / a,
    Exp: (a: any, b: any) => a ** b,
    $Exp: (a: any, b: any) => b ** a,
    Mod: (a: any, b: any) => a % b,
    $Mod: (a: any, b: any) => b % a,
    Inc: (a: any) => ++a, // eslint-disable-line no-param-reassign
    Dec: (a: any) => --a, // eslint-disable-line no-param-reassign
    Eql: (a: any, b: any) => a == b, // eslint-disable-line eqeqeq
    EqlS: (a: any, b: any) => a === b,
    NEql: (a: any, b: any) => a != b, // eslint-disable-line eqeqeq
    NEqlS: (a: any, b: any) => a !== b,
    Gtr: (a: any, b: any) => a > b,
    Geq: (a: any, b: any) => a >= b,
    Lss: (a: any, b: any) => a < b,
    Leq: (a: any, b: any) => a <= b,
    And: (a: any, b: any) => a && b,
    Or: (a: any, b: any) => a || b,
    Not: (a: any) => !a,
    BAnd: (a: any, b: any) => a & b,
    BOr: (a: any, b: any) => a | b,
    BXor: (a: any, b: any) => a ^ b,
    BNot: (a: any) => ~a,
    BLS: (a: any, b: any) => a << b,
    BRS: (a: any, b: any) => a >> b,
    BRSZ: (a: any, b: any) => a >>> b,
    Typeof: (a: any) => typeof a,
    Instanceof: (a: any, b: any) => a instanceof b,
    void: (a: any) => void a, // eslint-disable-line no-void
    in: (a: any, b: any) => a in b
};

const Ops: Record<string, typeof JSUnaryOp | typeof JSBinaryOp> = {};
for (const key in functions) {
    const f = functions[key];
    if (f.length === 1) {
        Ops[key] = class extends JSUnaryOp {
            static get _name() { return key; }
            static execute = f;
        };
    } else if (f.length === 2) {
        Ops[key] = class extends JSBinaryOp {
            static get _name() { return key; }
            static execute = f;
        };
    }
}

export default {
    typeof: Ops.Typeof,
    instanceof: Ops.Instanceof,
    void: Ops.void,
    in: Ops.in,
    "+": Ops.Add,
    "-": Ops.Sub,
    "!-": Ops.$Sub,
    "*": Ops.Mul,
    "/": Ops.Div,
    "!/": Ops.$Div,
    "**": Ops.Exp,
    "!**": Ops.$Exp,
    "%": Ops.Mod,
    "!%": Ops.Mod,
    "++": Ops.Inc,
    "--": Ops.Dec,
    "==": Ops.Eql,
    "===": Ops.EqlS,
    "!=": Ops.NEql,
    "!==": Ops.NEqlS,
    ">": Ops.Gtr,
    ">=": Ops.Geq,
    "<": Ops.Lss,
    "<=": Ops.Leq,
    "&&": Ops.And,
    "||": Ops.Or,
    "!": Ops.Not,
    "&": Ops.BAnd,
    "|": Ops.BOr,
    "^": Ops.BXor,
    "~": Ops.BNot,
    "<<": Ops.BLS,
    ">>": Ops.BRS,
    ">>>": Ops.BRSZ,
    "?": JSTernaryOp
};
