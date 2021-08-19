/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");

const cssPath = "./node_modules/semantic-ui-css/semantic.min.css";

const cssIn = fs.readFileSync(cssPath, "utf8");
const cssOut = cssIn.replace(/;;/, ";");

fs.writeFileSync(cssPath, cssOut, { encoding: "utf-8" });

console.log("Semantic UI CSS Patched");
