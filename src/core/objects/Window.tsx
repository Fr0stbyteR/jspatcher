import Importer from "./importer/Importer";

const lib = Importer.import("Window", window);
Importer.import("Window", { Array }, lib);

export default lib;
