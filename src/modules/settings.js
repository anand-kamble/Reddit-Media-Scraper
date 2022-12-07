//@ts-check
const fs = require("fs");
const globals = require("../globals");

const channel = "settings";

const callback = (
  /** @type {any} */ e,
  /** @type {{ downloadpath: string; proxy: string; parallellimit: number; }} */ d
) => {
  fs.writeFileSync("./config.json", JSON.stringify(d));
  globals.setGlobal("downloadFolder", d.downloadpath);
  globals.setGlobal("proxy", d.proxy);
  globals.setGlobal("parallelDownloads", d.parallellimit);
};
module.exports = { channel, callback };
