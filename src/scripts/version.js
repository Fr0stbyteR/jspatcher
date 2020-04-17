/* eslint-disable @typescript-eslint/no-var-requires */
const { version } = require("../../package.json");

const timestamp = new Date().getTime();

const VERSION = `${version}.${timestamp}`;

module.exports = VERSION;
