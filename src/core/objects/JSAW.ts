import ImporterNode from "../worklets/Importer";

export default async () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    const ctx = new AudioContext();
    await ImporterNode.register(ctx.audioWorklet);
    const importer = new ImporterNode(ctx);
    return importer.import();
};
