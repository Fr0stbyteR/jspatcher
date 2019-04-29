import { BaseObject, Bang, TMeta } from "./Base";
import Patcher from "../Patcher";
import Box from "../Box";

class JSOp extends BaseObject {
    static get _meta(): TMeta {
        return {
            ...super._meta,
            package: "Op"
        };
    }
}
class JSUnaryOp extends JSOp {
    static get _meta(): TMeta {
        return {
            ...super._meta,
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
    _mem: { result: any } = { result: null };
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 1;
        this.outlets = 1;
        this.update(box.parsed.args, box.parsed.props);
    }
    update(args: any[], props: { [key: string]: any }) { // eslint-disable-line @typescript-eslint/no-unused-vars
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
    execute(a: any) {} // eslint-disable-line class-methods-use-this, @typescript-eslint/no-unused-vars
}

class JSBinaryOp extends JSOp {
    static get _meta(): TMeta {
        return {
            ...super._meta,
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
    _mem: { arg: any; result: any } = { arg: null, result: null };
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 2;
        this.outlets = 1;
        this._mem.arg = 0;
        this._mem.result = 0;
        this.update(box.parsed.args, box.parsed.props);
    }
    update(args: any[], props: { [key: string]: any }) { // eslint-disable-line @typescript-eslint/no-unused-vars
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
    execute(a: any, b: any) {} // eslint-disable-line class-methods-use-this, @typescript-eslint/no-unused-vars
}

class JSTernaryOp extends JSOp {
    static get _meta(): TMeta {
        return {
            ...super._meta,
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
    _mem: { args: any[]; result: any } = { args: [], result: null };
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 3;
        this.outlets = 1;
        this._mem.args = [true, false];
        this._mem.result = true;
        this.update(box.parsed.args, box.parsed.props);
    }
    update(args: any[], props: { [key: string]: any }) { // eslint-disable-line @typescript-eslint/no-unused-vars
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
const functions: { [key: string]: (...args: any[]) => any } = {
    Add: (a: any, b: any) => a + b,
    Sub: (a: any, b: any) => a - b,
    Mul: (a: any, b: any) => a * b,
    Div: (a: any, b: any) => a / b,
    Exp: (a: any, b: any) => a ** b,
    Mod: (a: any, b: any) => a % b,
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
    Typeof: (a: any) => typeof a,
    Instanceof: (a: any, b: any) => a instanceof b
};

const Ops: { [key: string]: typeof JSUnaryOp | typeof JSBinaryOp } = {};
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
