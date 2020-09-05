interface WebpackWorker extends Worker {}
declare const WebpackWorker: {
    prototype: WebpackWorker;
    new (): WebpackWorker;
};

declare module "*.worker.ts" {
    export default WebpackWorker;
}
