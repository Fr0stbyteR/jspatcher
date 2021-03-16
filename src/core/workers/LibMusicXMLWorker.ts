import Worker from "./LibMusicXML.worker.ts"; // eslint-disable-line import/extensions
import { ILibMusicXMLWorker } from "./LibMusicXMLWorker.types";
import ProxyMain from "./ProxyMain";

export default class LibMusicXMLWorker extends ProxyMain<{}, ILibMusicXMLWorker> {
    static Worker = Worker;
    static fnNames: (keyof ILibMusicXMLWorker)[] = ["init", "libVersion", "libVersionStr", "musicxml2guidoVersion", "musicxml2guidoVersionStr", "string2guido", "xmlStringTranspose"];
}
