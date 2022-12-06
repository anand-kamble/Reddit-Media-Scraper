const { ipcMain } = require("electron")

const channel = "getFolder"

const callback = async (e, d) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  })
  mainWindow.webContents.send("takedefaultfolder", result.filePaths)
}

export { channel, callback }
