import RemotedImporter from "../importer/RemotedImporter";

export default async () => RemotedImporter.import("globalThis", globalThis, true);
