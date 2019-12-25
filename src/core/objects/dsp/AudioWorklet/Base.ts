export class DisposableAudioWorkletNode extends AudioWorkletNode {
    destroyed = false;
    destroy() {
        this.port.postMessage({ destroy: true });
        this.port.close();
        this.destroyed = true;
    }
}

export abstract class AudioWorkletRegister {
    static registering: boolean;
    static registered: boolean;
    static id: string;
    static processor: () => void;
    static Node: new (context: AudioContext, options?: AudioWorkletNodeOptions) => DisposableAudioWorkletNode;
    private static resolves: ((value?: void | PromiseLike<void>) => void)[] = [];
    private static rejects: ((reason?: any) => void)[] = [];
    private static async registerProcessor(audioWorklet: AudioWorklet) {
        this.registering = true;
        try {
            const awpString = `(${this.processor.toString()})();`;
            const url = window.URL.createObjectURL(new Blob([awpString], { type: "text/javascript" }));
            await audioWorklet.addModule(url);
            this.resolves.forEach(f => f());
            this.registering = false;
            this.registered = true;
        } catch (e) {
            this.rejects.forEach(f => f(e));
        }
        this.rejects = [];
        this.resolves = [];
    }
    static async register(audioWorklet: AudioWorklet): Promise<void> {
        const promise = new Promise<void>((resolve, reject) => {
            this.resolves.push(resolve);
            this.rejects.push(reject);
        });
        if (this.registered) return new Promise<void>(resolve => resolve());
        if (this.registering) return promise;
        if (!this.registered && audioWorklet) this.registerProcessor(audioWorklet);
        return promise;
    }
}
