import type * as monaco from "monaco-editor";
import type { FaustCompiler } from "@shren/faustwasm/dist/esm";

export const faustLangRegister = async (monacoEditor: typeof monaco, faust: FaustCompiler) => {
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
