export class DisposableAudioWorkletNode extends AudioWorkletNode {
    destroyed = false;
    destroy() {
        this.port.postMessage({ destroy: true });
        this.port.close();
        this.destroyed = true;
    }
}

export abstract class AudioWorkletRegister {
    static registered: boolean;
    static id: string;
    static processor: () => void;
    static Node: new (context: AudioContext, options?: AudioWorkletNodeOptions) => DisposableAudioWorkletNode;
    static async register(audioWorklet: AudioWorklet): Promise<void> {
        if (this.registered || !audioWorklet) return;
        const awpString = `(${this.processor.toString()})();`;
        const url = window.URL.createObjectURL(new Blob([awpString], { type: "text/javascript" }));
        await audioWorklet.addModule(url);
        this.registered = true;
    }
}
