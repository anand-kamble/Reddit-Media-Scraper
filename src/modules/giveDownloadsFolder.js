const { ipcMain } = require("electron")

const channel = "givedownloadsfolder"

const callback = (e, data) => {
  mainWindow.webContents.send("getdownloadsfolder", downloadFolder)
}

export { channel, callback }
