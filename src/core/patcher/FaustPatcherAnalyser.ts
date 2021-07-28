import type { Rec, Receive, Import, Iterator, FaustOp, Effect, In, Out, TLineMap } from "../objects/Faust";
import type Box from "./Box";
import type Line from "./Line";
import type Patcher from "./Patcher";

const mapLines = (box: Box, patcher: Patcher, visitedBoxes: Box[], ins: In[], recs: Rec[], lineMap: Map<Line, string>) => {
    if (visitedBoxes.indexOf(box) >= 0) return;
    visitedBoxes.push(box);
    if (box.object.class === "Iterator" && box !== visitedBoxes[0]) return;
    const inletLines = Array.from(box.inletLines);
    if (box.object.class === "Receive") {
        const { sendID, state: { sendMap } } = box.object as Receive;
        if (sendMap[sendID]) {
            sendMap[sendID].forEach(s => inletLines.push(...s.inletLines));
        }
    }
    inletLines.forEach(lines => lines.forEach((line) => {
        const { srcBox } = line;
        if (srcBox.object.class === "In" && ins.indexOf(srcBox.object as In) === -1) ins.push(srcBox.object as In);
        else if (srcBox.object.class === "Rec" && recs.indexOf(srcBox.object as Rec) === -1) recs.push(srcBox.object as Rec);
        if (srcBox.object.class === "Effect") lineMap.set(line, "_");
        else lineMap.set(line, `${(srcBox.object as FaustOp).resultID}_${line.srcOutlet}`);
        mapLines(srcBox, patcher, visitedBoxes, ins, recs, lineMap);
    }));
};
export const toFaustLambda = (patcher: Patcher, outs: FaustOp[], lambdaName: string) => {
    const exprs: string[] = [];
    const onces: string[] = [];
    const mainIns: string[] = [];
    const mainOuts: string[] = [];
    const recIns: string[] = [];
    const recOuts: string[] = [];
    const visitedBoxes: Box[] = [];
    let ins: In[] = [];
    const recs: Rec[] = [];
    const lineMap: TLineMap = new Map<Line, string>();
    // Build graph
    outs.forEach(out => mapLines(out.box, patcher, visitedBoxes, ins, recs, lineMap));
    visitedBoxes.forEach((box) => {
        if (box.object.class === "In") return;
        if (box.object.class === "Out") return;
        if (box.object.class === "Rec") return;
        if (outs.indexOf(box.object as FaustOp) !== -1) return;
        const { onces: o, exprs: e } = (box.object as FaustOp).toExpr(lineMap);
        if (o) onces.push(...o.filter(v => onces.indexOf(v) === -1));
        if (e) exprs.push(...e);
    });
    // Reverse order for readibility
    exprs.reverse();
    // Build rec in/outs
    recs.forEach((rec) => {
        exprs.push(...rec.toExpr(lineMap).exprs || []);
        const recIn = rec.resultID;
        const recOut = `${recIn}_0`;
        recIns.push(recIn);
        recOuts.push(recOut);
    });
    // Build main in/outs
    ins = ins.sort((a, b) => a.index - b.index);
    ins.forEach((in_) => {
        const id = `${in_.resultID}_0`;
        if (mainIns.indexOf(id) === -1) mainIns.push(id);
    });
    outs.forEach((out) => {
        if (out.class === "Iterator") exprs.push(...(out as Iterator).toNormalExpr(lineMap).exprs || []);
        else exprs.push(...out.toExpr(lineMap).exprs || []);
        const id = out.resultID;
        if (mainIns.indexOf(id) === -1) mainOuts.push(id);
    });
    // Generate Final expressions
    exprs.forEach((s, i) => exprs[i] = `    ${s.replace(/\n/g, "\n    ")}`); // indent
    if (recIns.length) {
        exprs.unshift(`Main(${[...recOuts, ...mainIns].join(", ")}) = ${[...recIns, ...mainOuts].join(", ")} with {`);
        exprs.push(
            "};",
            `Rec = ${recIns.map(() => "_").join(", ")} : ${recOuts.map(() => "_").join(", ")};`,
            `${lambdaName} = Main ~ Rec : ${[...recIns.map(() => "!"), ...mainOuts.map(() => "_")].join(", ")};`
        );
    } else if (mainIns.length) {
        exprs.unshift(`${lambdaName}(${mainIns.join(", ")}) = ${mainOuts.join(", ")} with {`);
        exprs.push("};");
    } else if (exprs.length) {
        exprs.unshift(`${lambdaName} = ${mainOuts.join(", ")} with {`);
        exprs.push("};");
    } else {
        exprs.push(`${lambdaName} = 0;`);
    }
    return { onces, exprs, ins, outs };
};
export const toFaustDspCode = (patcher: Patcher) => inspectFaustPatcher(patcher).code;
export const inspectFaustPatcher = (patcher: Patcher) => {
    const imports: Import[] = [];
    let outs: Out[] = [];
    const effects: Effect[] = [];
    // Find outs and imports
    for (const boxId in patcher.boxes) {
        const box = patcher.boxes[boxId];
        if (box.object.class === "Effect") effects.push(box.object as Effect);
        else if (box.object.class === "Out") outs.push(box.object as Out);
        else if (box.object.class === "Import") imports.push(box.object as Import);
    }
    outs = outs.sort((a, b) => a.index - b.index);
    const { onces, exprs, ins } = toFaustLambda(patcher, outs, "process");
    if (effects.length) {
        const { onces: fxOnces, exprs: fxExprs, ins: fxIns } = toFaustLambda(patcher, [effects[0]], "effect");
        onces.push(...fxOnces.filter(v => onces.indexOf(v) === -1));
        exprs.push(...fxExprs);
        ins.push(...fxIns);
    }
    imports.map(i => i.toOnceExpr()).forEach(o => onces.push(...o.filter(v => onces.indexOf(v) === -1)));
    const code = `${onces.join("\n")}${onces.length ? "\n" : ""}${exprs.join("\n")}\n`;
    return { code, onces, exprs, ins, outs };
};
