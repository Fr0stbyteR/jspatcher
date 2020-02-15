export const registeredProcessorsMap: { [key: string]: boolean } = {};

const AWN = window.AudioWorkletNode ? AudioWorkletNode : class {};
type DataToProcessor = DisposableAudioWorkletMessageEventDataToProcessor;
export class DisposableAudioWorkletNode<F extends { [key: string]: any } = { [key: string]: any }, T extends DataToProcessor = DataToProcessor, P extends string = string> extends AWN {
    get port(): AudioWorkletMessagePort<F, T> {
        return super.port;
    }
    get parameters(): DisposableAudioParamMap<P> {
        return super.parameters as DisposableAudioParamMap<P>;
    }
    destroyed = false;
    destroy() {
        this.port.postMessage({ destroy: true } as T);
        this.port.close();
        this.destroyed = true;
    }
}

export abstract class AudioWorkletRegister {
    static processorID: string;
    static processorURL: string;
    static registeredProcessorsMap = registeredProcessorsMap;
    static registering = false;
    static get registered() {
        return this.registeredProcessorsMap[this.processorID];
    }
    static set registered(b: boolean) {
        this.registeredProcessorsMap[this.processorID] = b;
    }
    static processor: () => void;
    static Node: new (context: AudioContext, options?: AudioWorkletNodeOptions) => DisposableAudioWorkletNode;
    private static resolves: { [id: string]: ((value?: void | PromiseLike<void>) => void)[]} = {};
    private static rejects: { [id: string]: ((reason?: any) => void)[] } = {};
    private static async registerProcessor(audioWorklet: AudioWorklet) {
        this.registering = true;
        try {
            const url = this.processorURL || window.URL.createObjectURL(new Blob([`(${this.processor.toString()})();`], { type: "text/javascript" }));
            await audioWorklet.addModule(url);
            this.resolves[this.processorID].forEach(f => f());
            this.registering = false;
            this.registered = true;
        } catch (e) {
            this.rejects[this.processorID].forEach(f => f(e));
        }
        this.rejects[this.processorID] = [];
        this.resolves[this.processorID] = [];
    }
    static async register(audioWorklet: AudioWorklet): Promise<void> {
        if (!this.resolves[this.processorID]) this.resolves[this.processorID] = [];
        if (!this.rejects[this.processorID]) this.rejects[this.processorID] = [];
        const promise = new Promise<void>((resolve, reject) => {
            this.resolves[this.processorID].push(resolve);
            this.rejects[this.processorID].push(reject);
        });
        if (this.registered) return new Promise<void>(resolve => resolve());
        if (this.registering) return promise;
        if (!this.registered && audioWorklet) this.registerProcessor(audioWorklet);
        return promise;
    }
}
