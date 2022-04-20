import { languages, editor, Position, Range } from "monaco-editor/esm/vs/editor/editor.api";
import type { FaustCompiler } from "@shren/faustwasm";
import { Faust2Doc, TFaustDocs, TFaustDoc } from "./Faust2Doc";
import { docSections, faustDocURL } from "./documentation";

export type FaustLanguageProviders = {
    hoverProvider: languages.HoverProvider;
    tokensProvider: languages.IMonarchLanguage;
    completionItemProvider: languages.CompletionItemProvider;
    docs: TFaustDocs;
};
export const language: languages.ILanguageExtensionPoint = {
    id: "faust",
    extensions: ["dsp", "lib"],
    mimetypes: ["application/faust"]
};
export const config: languages.LanguageConfiguration = {
    comments: {
        lineComment: "//",
        blockComment: ["/*", "*/"]
    },
    brackets: [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"]
    ],
    autoClosingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"', notIn: ["string"] },
        { open: "/*", close: "*/", notIn: ["string"] }
    ]
};
export const theme: editor.IStandaloneThemeData = {
    base: "vs-dark",
    inherit: true,
    rules: [
        { token: "faustFunctions", foreground: "DDDD99" },
        { token: "faustKeywords", foreground: "4499CC" },
        { token: "faustLib", foreground: "CCCCBB" },
        { token: "faustCompOperators", foreground: "FFDDFF" },
        { token: "identifier", foreground: "77CCFF" }
    ],
    colors: null
};
const faustKeywords = [
    "import", "component", "declare", "library", "environment", "int", "float",
    "letrec", "with", "class", "process", "effect", "inputs", "outputs"
];
const faustFunctions = [
    "mem", "prefix", "rdtable", "rwtable",
    "select2", "select3", "ffunction", "fconstant", "fvariable",
    "route", "waveform", "soundfile",
    "button", "checkbox", "vslider", "hslider", "nentry",
    "vgroup", "hgroup", "tgroup", "vbargraph", "hbargraph", "attach",
    "acos", "asin", "atan", "atan2", "cos", "sin", "tan", "exp",
    "log", "log10", "pow", "sqrt", "abs", "min", "max", "fmod",
    "remainder", "floor", "ceil", "rint",
    "seq", "par", "sum", "prod"
];
const getFile = async (fileName: string, faust: FaustCompiler) => {
    if (faust) return faust.fs().readFile("/usr/share/faust/" + fileName, { encoding: "utf8" }) as string;
    const libPath = "https://faustlibraries.grame.fr/libs/";
    const res = await fetch(libPath + fileName);
    return res.text();
};
type TMatchedFaustDoc = { nameArray: string[]; name: string; range: Range; doc: TFaustDoc };
/**
 * Match an available doc key from monaco editor
 *
 * @param {TFaustDocs} doc
 * @param {editor.ITextModel} model
 * @param {Position} position
 * @returns {TMatchedFaustDoc} full: [...prefixes, name], range: a monaco range object, doc: a FaustDoc object
 */
export const matchDocKey = (doc: TFaustDocs, model: editor.ITextModel, position: Position): TMatchedFaustDoc => {
    const line$ = position.lineNumber;
    const line = model.getLineContent(line$);
    const wordAtPosition = model.getWordAtPosition(position);
    if (!wordAtPosition) return null;
    let column$ = wordAtPosition.startColumn - 1;
    const name = wordAtPosition.word;
    const prefixes: string[] = [];
    while (column$ - 2 >= 0 && line[column$ - 1] === ".") {
        column$ -= 2;
        const prefixWord = model.getWordAtPosition(new Position(line$, column$));
        prefixes.splice(0, 0, prefixWord.word);
        column$ = prefixWord.startColumn - 1;
    }
    const nameArray = [...prefixes, name];
    while (nameArray.length) {
        const name = nameArray.join(".");
        const e = doc[name];
        if (e) {
            return {
                nameArray,
                name,
                range: new Range(line$, column$ + 1, line$, wordAtPosition.endColumn),
                doc: e
            };
        }
        column$ += nameArray.splice(0, 1)[0].length + 1;
    }
    return null;
};
export const getProviders = async (faust: FaustCompiler): Promise<FaustLanguageProviders> => {
    let libDocs: TFaustDocs = {};
    let primDocs: TFaustDocs = {};
    try {
        libDocs = await Faust2Doc.parse("stdfaust.lib", async (fileName: string) => getFile(fileName, faust));
        primDocs = await Faust2Doc.parse("primitives.lib", async (fileName: string) => getFile(fileName, faust));
    } catch (e) { console.error(e); } // eslint-disable-line no-empty, no-console
    const faustLib = Object.keys(libDocs);

    const hoverProvider: languages.HoverProvider = {
        provideHover: (model, position) => {
            const matched = matchDocKey({ ...primDocs, ...libDocs }, model, position);
            if (matched) {
                const prefix = matched.nameArray.slice();
                const name = prefix.pop();
                const doc = matched.doc;
                return {
                    range: matched.range,
                    contents: [
                        { value: `\`\`\`\n${prefix.length ? "(" + prefix.join(".") + ".)" : ""}${name}\n\`\`\`` },
                        { value: doc.doc.replace(/#+/g, "######") },
                        { value: prefix.length ? `[Detail...](${faustDocURL}/${docSections[prefix.slice(0, 2).toString()]}/#${prefix.join(".")}${doc.name.replace(/[[\]|]/g, "").toLowerCase()})` : "[Detail...](https://faustdoc.grame.fr/manual/syntax/index.html#faust-syntax)" }
                    ]
                };
            }
            return null;
        }
    };
    const tokensProvider: languages.IMonarchLanguage = ({
        faustKeywords,
        faustFunctions,
        faustLib,
        defaultToken: "invalid",
        tokenPostfix: ".dsp",
        faustCompOperators: [
            "~", ",", ":", "<:", ":>"
        ],
        operators: [
            "=",
            "+", "-", "*", "/", "%", "^",
            "&", "|", "xor", "<<", ">>",
            ">", "<", "==", "<=", ">=", "!=",
            "@", "'"
        ],
        // we include these common regular expressions
        symbols: /[=><!~?:&|+\-*/^%]+/,
        // C# style strings
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
        // The main tokenizer for our languages
        tokenizer: {
            root: [
                // identifiers and keywords
                [/!|_/, "keyword"],
                [/[a-z_$]([\w.$]*[\w$])?/, {
                    cases: {
                        "@faustFunctions": "faustFunctions",
                        "@faustKeywords": "faustKeywords",
                        "@faustLib": "faustLib",
                        "@default": "identifier"
                    }
                }],
                [/[A-Z][\w$]*/, "type.identifier"],
                // whitespace
                { include: "@whitespace" },
                // delimiters and operators
                [/[{}()[\]]/, "@brackets"],
                [/~|,|<:|:>|:/, "faustCompOperators"],
                [/[<>](?!@symbols)/, "@brackets"],
                [/=|\+|-|\*|\/|%|\^|&|\||xor|<<|>>|>|<|==|<=|>=|!=|@|'/, {
                    cases: {
                        "@operators": "operators",
                        "@default": ""
                    }
                }],
                // numbers
                [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
                [/0[xX][0-9a-fA-F]+/, "number.hex"],
                [/\d+/, "number"],
                // delimiter: after number because of .\d floats
                [/[;.]/, "delimiter"],
                // strings
                [/"/, { token: "string", next: "@string" }]
            ],
            comment: [
                [/[^/*]+/, "comment"],
                [/\/\*/, "comment", "@push"],
                [/\*\//, "comment", "@pop"],
                [/[/*]/, "comment"]
            ],
            string: [
                [/[^\\"$]+/, "string"],
                [/@escapes/, "string.escape"],
                [/\\./, "string.escape.invalid"],
                [/"/, "string", "@pop"]
            ],
            whitespace: [
                [/[ \t\r\n]+/, "white"],
                [/\/\*/, "comment", "@comment"],
                [/\/\/.*$/, "comment"]
            ]
        }
    } as any);
    const completionItemProvider: languages.CompletionItemProvider = {
        provideCompletionItems: () => {
            const suggestions: languages.CompletionItem[] = [];
            [...faustKeywords, ...faustFunctions, ...faustLib].forEach((e) => {
                suggestions.push({
                    label: e,
                    kind: languages.CompletionItemKind.Text,
                    insertText: e,
                    range: null
                });
            });
            return { suggestions };
        }
    };
    return { hoverProvider, tokensProvider, completionItemProvider, docs: libDocs };
};
