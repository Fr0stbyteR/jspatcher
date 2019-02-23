import { BaseObject, Bang } from "./Base";
import { Patcher } from "../Patcher";
import { Box } from "../Box";
class JSUnaryOp extends BaseObject {
    static get _meta() {
        return { ...BaseObject._meta,
            package: "Op",
            icon: "",
            description: "Unary Operation",
            inlets: [{
                isHot: true,
                type: "anything",
                description: "First element"
            }],
            outlets: [{
                type: "anything",
                description: "Result"
            }]
        };
    }
    _mem: { result: any };
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 1;
        this.outlets = 1;
        this.update(box.parsed.args, box.parsed.props);
    }
    update(args: any[], props: { [key: string]: any }) {
        this._mem.result = 0;
        return this;
    }
    fn(data: any, inlet: number) {
        if (inlet === 0 && data instanceof Bang) {
            this.outlet(0, this._mem.result);
            return this;
        }
        if (inlet === 0) {
            try {
                this._mem.result = this.execute(data);
                this.outlet(0, this._mem.result);
            } catch (e) {
                this.error(e);
            }
        }
        return this;
    }
    execute(a: any) {
        return;
    }
}

class JSBinaryOp extends BaseObject {
    static get _meta() {
        return { ...BaseObject._meta,
            package: "Op",
            icon: "",
            description: "Binary Operation",
            inlets: [{
                isHot: true,
                type: "anything",
                description: "First element"
            }, {
                isHot: false,
                type: "anything",
                description: "Second element"
            }],
            outlets: [{
                type: "anything",
                description: "Result"
            }],
            args: [{
                type: "anything",
                optional: true,
                default: 0,
                description: "Initial second element"
            }]
        };
    }
    _mem: { arg: any, result: any };
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 2;
        this.outlets = 1;
        this._mem.arg = 0;
        this._mem.result = 0;
        this.update(box.parsed.args, box.parsed.props);
    }
    update(args: any[], props: { [key: string]: any }) {
        this._mem.arg = 0;
        this._mem.result = 0;
        if (args.length === 0) return this;
        this._mem.arg = args[0];
        return this;
    }
    fn(data: any, inlet: number) {
        if (inlet === 0 && data instanceof Bang) {
            this.outlet(0, this._mem.result);
            return this;
        }
        if (inlet === 1) {
            this._mem.arg = data;
        }
        if (inlet === 0) {
            try {
                this._mem.result = this.execute(data, this._mem.arg);
                this.outlet(0, this._mem.result);
            } catch (e) {
                this.error(e);
            }
        }
        return this;
    }
    execute(a: any, b: any) {
        return;
    }
}

class JSTernaryOp extends BaseObject {
    static get _meta() {
        return { ...BaseObject._meta,
            package: "Op",
            icon: "",
            description: "Ternary Operation",
            inlets: [{
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
            }],
            outlets: [{
                type: "anything",
                description: "Result"
            }],
            args: [{
                type: "anything",
                optional: true,
                default: true,
                description: "Initial true output"
            }, {
                type: "anything",
                optional: true,
                default: false,
                description: "Initial false output"
            }]
        };
    }
    _mem: { args: any[], result: any };
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 3;
        this.outlets = 1;
        this._mem.args = [true, false];
        this._mem.result = true;
        this.update(box.parsed.args, box.parsed.props);
    }
    update(args: any[], props: { [key: string]: any }) {
        this._mem.args = [true, false];
        this._mem.result = true;
        if (args.length === 0) return this;
        this._mem.args[0] = args[0];
        this._mem.args[1] = args[1];
        return this;
    }
    fn(data: any, inlet: number) {
        if (inlet === 0 && data instanceof Bang) {
            this.outlet(0, this._mem.result);
            return this;
        }
        if (inlet === 1) {
            this._mem.args[0] = data;
        }
        if (inlet === 2) {
            this._mem.args[1] = data;
        }
        if (inlet === 0) {
            try {
                this._mem.result = data ? this._mem.args[0] : this._mem.args[1];
                this.outlet(0, this._mem.result);
            } catch (e) {
                this.error(e);
            }
        }
        return this;
    }
}
const functions = {
    Add: (a: any, b: any) => a + b,
    Sub: (a: any, b: any) => a - b,
    Mul: (a: any, b: any) => a * b,
    Div: (a: any, b: any) => a / b,
    Exp: (a: any, b: any) => a ** b,
    Mod: (a: any, b: any) => a % b,
    // tslint:disable-next-line: no-parameter-reassignment
    Inc: (a: any) => ++a,
    // tslint:disable-next-line: no-parameter-reassignment
    Dec: (a: any) => --a,
    // tslint:disable-next-line: triple-equals
    Eql: (a: any, b: any) => a == b,
    EqlS: (a: any, b: any) => a === b,
    // tslint:disable-next-line: triple-equals
    NEql: (a: any, b: any) => a != b,
    NEqlS: (a: any, b: any) => a !== b,
    Gtr: (a: any, b: any) => a > b,
    Geq: (a: any, b: any) => a >= b,
    Lss: (a: any, b: any) => a < b,
    Leq: (a: any, b: any) => a <= b,
    And: (a: any, b: any) => a && b,
    Or: (a: any, b: any) => a || b,
    Not: (a: any) => !a,
    Typeof: (a: any) => typeof a,
    Instanceof: (a: any, b: any) => a instanceof b
} as { [key: string]: (...args: any[]) => any };

const Ops = {} as { [key: string]: typeof JSUnaryOp | typeof JSBinaryOp };
for (const key in functions) {
    const f = functions[key];
    if (f.length === 1) {
        Ops[key] = class extends JSUnaryOp {
            static get _meta() {
                return { ...JSUnaryOp._meta, name: key };
            }
            execute = f;
        };
    } else if (f.length === 2) {
        Ops[key] = class extends JSBinaryOp {
            static get _meta() {
                return { ...JSBinaryOp._meta, name: key };
            }
            execute = f;
        };
    }
}

export default {
    Typeof: Ops.Typeof,
    Instanceof: Ops.Instanceof,
    "+": Ops.Add,
    "-": Ops.Sub,
    "*": Ops.Mul,
    "/": Ops.Div,
    "**": Ops.Exp,
    "%": Ops.Mod,
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
    "?": JSTernaryOp
};
