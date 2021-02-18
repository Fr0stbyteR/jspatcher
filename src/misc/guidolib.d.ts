/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../../node_modules/@grame/guidolib/libGUIDOEngine.d.ts"/>
/// <reference path="../../node_modules/@grame/guidolib/guidoengine.ts"/>
/// <reference path="./embind.d.ts"/>

type EnumToObject<T extends Record<string, any>> = { [key in keyof Omit<T, number>]: { value: T[key]; }; } & { values: { [key: number]: { value: number } } };

interface ARHandler extends ClassHandle {}
interface GRHandler extends ClassHandle {}

interface GuidoParser extends ClassHandle {}
interface GuidoStream extends ClassHandle {}
interface VGDevice extends ClassHandle {}

interface PianoRoll extends ClassHandle {}

declare module "@grame/guidolib" {
    interface BindingError extends Error {}
    interface InternalError extends Error {}
    interface UnboundTypeError extends Error {}
    interface GuidoModule extends EmscriptenModule {
        BindingError: new (...args: ConstructorParameters<typeof Error>) => BindingError;
        GUIDOFactoryAdapter: new () => GUIDOFactoryAdapter;
        GUIDOPianoRollAdapter: new () => GUIDOPianoRollAdapter;
        GUIDOReducedProportionalAdapter: new () => GUIDOReducedProportionalAdapter;
        GUIDOScoreMap: new () => GUIDOScoreMap;
        GuidoElementSelector: EnumToObject<typeof GuidoElementSelector>;
        GuidoEngineAdapter: new () => GuidoEngineAdapter;
        GuidoErrCode: EnumToObject<typeof GuidoErrCode>;
        GuidoParser: new () => GuidoParser;
        GuidoStream: new () => GuidoStream;
        InternalError: new (...args: ConstructorParameters<typeof Error>) => InternalError;
        NodeAR: new () => ARHandler;
        NodeGR: new () => GRHandler;
        PianoRoll: new () => PianoRoll;
        PianoRollType: EnumToObject<typeof PianoRollType>;
        RProportional: new () => ReducedProportional;
        UnboundTypeError: new (...args: ConstructorParameters<typeof Error>) => UnboundTypeError;
        // ar2MIDIFile(): any;
        flushPendingDeletes(): void;
        getInheritedInstanceCount(): number;
        getLiveInheritedInstances(): any[];
    }
    const GuidoModule: {
        (options?: Partial<EmscriptenModule & { ENVIRONMENT: Emscripten.EnvironmentType }>): GuidoModule;
        new (options?: Partial<EmscriptenModule & { ENVIRONMENT: Emscripten.EnvironmentType }>): GuidoModule;
    };

    export = GuidoModule;
}
