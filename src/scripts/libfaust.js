/* eslint-disable */
const fs = require("fs");

const map = { "libfaust-wasm.wasm": "libfaust-wasm.wasm", "libfaust-wasm.data": "libfaust-wasm.data" };
for (const key in map) {
    fs.copyFileSync("./node_modules/faust2webaudio/dist/" + key, "./dist/deps/" + map[key]);
}
