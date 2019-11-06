/* eslint-disable */
const fs = require("fs");

if (fs.existsSync("dist")) {
    if (fs.existsSync("dist/assets")) {
        fs.readdirSync("dist/assets").forEach((filename) => {
            fs.unlinkSync("dist/assets/" + filename);
        });
        fs.rmdirSync("dist/assets");
    }
    if (fs.existsSync("dist/js")) {
        fs.readdirSync("dist/js").forEach((filename) => {
            fs.unlinkSync("dist/js/" + filename);
        });
        fs.rmdirSync("dist/js");
    }
    fs.readdirSync("dist").forEach((filename) => {
        if (filename.match(/precache-manifest\..+\.js/)) fs.unlinkSync("dist/" + filename);
    });
}