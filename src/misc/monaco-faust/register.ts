import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import { Faust } from "faust2webaudio";
import * as faustlang from "./FaustLang";

export const faustLangRegister = (monaco: typeof monacoEditor, faust: Faust) => {
    monaco.languages.register(faustlang.language);
    monaco.languages.setLanguageConfiguration("faust", faustlang.config);
    monaco.editor.defineTheme("vs-dark", faustlang.theme);
    faustlang.getProviders(faust).then((providers) => {
        monaco.languages.registerHoverProvider("faust", providers.hoverProvider);
        monaco.languages.setMonarchTokensProvider("faust", providers.tokensProvider);
        monaco.languages.registerCompletionItemProvider("faust", providers.completionItemProvider);
    });
};
