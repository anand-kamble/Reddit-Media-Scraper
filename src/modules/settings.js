//@ts-check
const fs = require("fs");
const globals = require("../globals");

const channel = "settings";

const callback = (
  /** @type {any} */ e,
  /** @type {{ downloadpath: string; proxy: string; parallellimit: number; }} */ d
) => {
  fs.writeFileSync("./config.json", JSON.stringify(d));
  // globals.downloadFolder = d.downloadpath;
  globals.setGlobal("downloadFolder", d.downloadpath);
  // globals.proxy = d.proxy;
  globals.setGlobal("proxy", d.proxy);
  // globals.parallelDownloads = d.parallellimit;
  globals.setGlobal("parallelDownloads", d.parallellimit);
};
module.exports = { channel, callback };
