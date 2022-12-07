//@ts-check
const { dialog } = require("electron");
const globals = require("../globals");
const { logging } = require("../utils");

const channel = "select-dirs";

const callback = async (event, arg) => {
  const mainWindow = globals.getGlobal("mainWindow");
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });
  logging("directories selected" + result.filePaths.toString());
  // globals.downloadPath = result.filePaths;
  globals.setGlobal("downloadPath", result.filePaths);
  mainWindow.webContents.send("getdownloadsfolder", result.filePaths);
};

module.exports = { channel, callback };
