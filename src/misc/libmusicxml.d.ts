declare module "@grame/libmusicxml" {
    interface LibMusicXMLAdapter {
        libVersion(): number;
        libVersionStr(): string;

        musicxml2guidoVersion(): number;
        musicxml2guidoVersionStr(): string;

        string2guido(xml: string, generateBars: boolean): string;
        xmlStringTranspose(xml: string, interval: number): string;
    }

    interface MusicXMLModule extends EmscriptenModule {
        libMusicXMLAdapter: new () => LibMusicXMLAdapter;
    }
    const MusicXMLModule: {
        (options?: Partial<EmscriptenModule & { ENVIRONMENT: Emscripten.EnvironmentType }>): MusicXMLModule;
        new (options?: Partial<EmscriptenModule & { ENVIRONMENT: Emscripten.EnvironmentType }>): MusicXMLModule;
    };

    export = MusicXMLModule;
}
