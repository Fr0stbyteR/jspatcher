export const registeredProcessors: WeakMap<AudioWorklet, Set<string>> = window.jspatcherEnv?.AudioWorkletRegister?.registeredProcessors || new WeakMap();
export const registeringProcessors: WeakMap<AudioWorklet, Set<string>> = window.jspatcherEnv?.AudioWorkletRegister?.registeringProcessors || new WeakMap();
export const resolves: Record<string, ((value?: void | PromiseLike<void>) => void)[]> = window.jspatcherEnv?.AudioWorkletRegister?.resolves || {};
export const rejects: Record<string, ((reason?: any) => void)[]> = window.jspatcherEnv?.AudioWorkletRegister?.rejects || {};

export default class AudioWorkletRegister {
    static registeredProcessors = registeredProcessors;

    static registeringProcessors = registeringProcessors;

    static resolves = resolves;

    static rejects = rejects;

    private static async registerProcessor(audioWorklet: AudioWorklet, processorId: string, processor: string | ((id: string, ...injections: any[]) => void), ...injection: any[]) {
        this.registeringProcessors.get(audioWorklet).add(processorId);
        try {
            const url = typeof processor === "string" ? processor : URL.createObjectURL(new Blob([`(${processor.toString()})(${[processorId, ...injection].map(JSON.stringify as (arg: any) => string).join(", ")});`], { type: "text/javascript" }));
            await audioWorklet.addModule(url);
            this.resolves[processorId].forEach(f => f());
            this.registeringProcessors.get(audioWorklet).delete(processorId);
            this.registeredProcessors.get(audioWorklet).add(processorId);
        } catch (e) {
            this.rejects[processorId].forEach(f => f(e));
        }
        this.rejects[processorId] = [];
        this.resolves[processorId] = [];
    }

    static async register(audioWorklet: AudioWorklet, processorId: string, processor: string | ((id: string, ...injections: any[]) => void), ...injection: any[]) {
        if (!this.resolves[processorId]) this.resolves[processorId] = [];
        if (!this.rejects[processorId]) this.rejects[processorId] = [];
        const promise = new Promise<void>((resolve, reject) => {
            this.resolves[processorId].push(resolve);
            this.rejects[processorId].push(reject);
        });
        if (!this.registeringProcessors.has(audioWorklet)) {
            this.registeringProcessors.set(audioWorklet, new Set());
        }
        if (!this.registeredProcessors.has(audioWorklet)) {
            this.registeredProcessors.set(audioWorklet, new Set());
        }
        const registered = this.registeredProcessors.get(audioWorklet).has(processorId);
        const registering = this.registeringProcessors.get(audioWorklet).has(processorId);
        if (registered) return Promise.resolve();
        if (registering) return promise;
        if (!registered && audioWorklet) {
            this.registerProcessor(audioWorklet, processorId, processor, ...injection);
        }
        return promise;
    }
}
