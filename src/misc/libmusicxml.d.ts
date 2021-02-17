/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../../node_modules/@grame/libmusicxml/libmusicxml.d.ts"/>

declare module "@grame/libmusicxml" {
    interface MusicXMLModule extends EmscriptenModule {
        libMusicXMLAdapter: new () => libMusicXMLAdapter;
    }
    const MusicXMLModule: {
        (options?: Partial<EmscriptenModule & { ENVIRONMENT: Emscripten.EnvironmentType }>): MusicXMLModule;
        new (options?: Partial<EmscriptenModule & { ENVIRONMENT: Emscripten.EnvironmentType }>): MusicXMLModule;
    };

    export = MusicXMLModule;
}
