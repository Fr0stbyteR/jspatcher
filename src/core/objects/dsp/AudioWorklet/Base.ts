export const registeredProcessors = new Set<string>();

const AWN: typeof AudioWorkletNode = window.AudioWorkletNode ? AudioWorkletNode : null;
type DataToProcessor = DisposableAudioWorkletMessageEventDataToProcessor;
export class DisposableAudioWorkletNode<F extends { [key: string]: any } = { [key: string]: any }, T extends DataToProcessor = DataToProcessor, P extends string = string, O extends any = any> extends AWN {
    get port(): AudioWorkletMessagePort<F, T> {
        return super.port;
    }
    get parameters(): DisposableAudioParamMap<P> {
        return super.parameters as DisposableAudioParamMap<P>;
    }
    protected readonly options: TypedAudioWorkletNodeOptions<O>;
    destroyed = false;
    destroy() {
        this.port.postMessage({ destroy: true } as T);
        this.port.close();
        this.destroyed = true;
    }
    constructor(context: BaseAudioContext, name: string, options?: TypedAudioWorkletNodeOptions<O>) {
        super(context, name, options);
        this.options = options;
    }
}

export abstract class AudioWorkletRegister {
    static processorID: string;
    static processorURL: string;
    static registeredProcessors = registeredProcessors;
    static registering = false;
    static get registered() {
        return this.registeredProcessors.has(this.processorID);
    }
    static set registered(b: boolean) {
        this.registeredProcessors.add(this.processorID);
    }
    static processor: () => void;
    static Node: new (context: BaseAudioContext, options?: AudioWorkletNodeOptions) => DisposableAudioWorkletNode;
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
