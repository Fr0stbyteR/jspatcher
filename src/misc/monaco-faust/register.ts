import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { Faust } from "faust2webaudio";

export const faustLangRegister = async (monacoEditor: typeof monaco, faust: Faust) => {
    const faustLang = await import("./FaustLang");
    monacoEditor.languages.register(faustLang.language);
    monacoEditor.languages.setLanguageConfiguration("faust", faustLang.config);
    monacoEditor.editor.defineTheme("vs-dark", faustLang.theme);
    const providers = await faustLang.getProviders(faust);
    monacoEditor.languages.registerHoverProvider("faust", providers.hoverProvider);
    monacoEditor.languages.setMonarchTokensProvider("faust", providers.tokensProvider);
    monacoEditor.languages.registerCompletionItemProvider("faust", providers.completionItemProvider);
    return { providers, faustLang };
};
