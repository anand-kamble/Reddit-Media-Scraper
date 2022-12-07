//@ts-check
const globals = require("../globals");

const channel = "givedownloadsfolder";

const callback = () => {
  const mainWindow = globals.getGlobal("mainWindow");
  mainWindow.webContents.send("getdownloadsfolder", globals.downloadFolder);
};

module.exports = { channel, callback };
