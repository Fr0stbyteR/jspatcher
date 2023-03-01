/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const fs = require("fs");

fs.copyFileSync(path.join(__dirname, "../../version.json"), path.join(__dirname, "../../dist/version.json"));
fs.unlinkSync(path.join(__dirname, "../../version.json"));
