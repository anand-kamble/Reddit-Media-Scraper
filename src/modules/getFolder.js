//@ts-check
const { dialog } = require("electron");
const globals = require("../globals");

const channel = "getFolder";

const callback = async () => {
  if (globals.mainWindow) {
    const result = await dialog.showOpenDialog(globals.mainWindow, {
      properties: ["openDirectory"],
    });
    globals.mainWindow?.webContents.send("takedefaultfolder", result.filePaths);
  }
};

module.exports = { channel, callback };
