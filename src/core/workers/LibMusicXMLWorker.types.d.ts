export interface ILibMusicXMLWorker {
    init(): Promise<void>;

    libVersion(): number;
    libVersionStr(): string;

    musicxml2guidoVersion(): number;
    musicxml2guidoVersionStr(): string;

    string2guido(xml: string, generateBars: boolean): string;
    xmlStringTranspose(xml: string, interval: number): string;
}
