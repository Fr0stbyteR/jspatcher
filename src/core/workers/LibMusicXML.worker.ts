import type * as MusicXMLModule from "@grame/libmusicxml";
import { ILibMusicXMLWorker } from "./LibMusicXMLWorker.types";
import ProxyWorker from "./ProxyWorker";

class LibMusicXML extends ProxyWorker<ILibMusicXMLWorker> implements ILibMusicXMLWorker {
    private module: MusicXMLModule;
    private adapter: InstanceType<MusicXMLModule["libMusicXMLAdapter"]>;
    async init() {
        const locateFile = (url: string, dir: string) => "../deps/" + url;
        const Module = (await import("@grame/libmusicxml") as any).default as typeof MusicXMLModule;
        return new Promise<void>((resolve, reject) => {
            const module = new Module({ locateFile });
            module.onRuntimeInitialized = () => {
                this.module = module;
                const Adapter = this.module.libMusicXMLAdapter;
                this.adapter = new Adapter();
                resolve();
            };
        });
    }

    libVersion() { return this.adapter.libVersion(); }
    libVersionStr() { return this.adapter.libVersionStr(); }

    musicxml2guidoVersion() { return this.adapter.musicxml2guidoVersion(); }
    musicxml2guidoVersionStr() { return this.adapter.musicxml2guidoVersionStr(); }

    string2guido(xml: string, genBars: boolean) { return this.adapter.string2guido(xml, genBars); }
    xmlStringTranspose(xml: string, interval: number) { return this.adapter.xmlStringTranspose(xml, interval); }
}
// eslint-disable-next-line no-new
new LibMusicXML();
