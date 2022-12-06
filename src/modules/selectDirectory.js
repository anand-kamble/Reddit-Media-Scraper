const { ipcMain } = require("electron")

const channel = "select-dirs"

const callback = async (event, arg) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  })
  logging("directories selected", result.filePaths)
  downloadPath = result.filePaths
  mainWindow.webContents.send("getdownloadsfolder", result.filePaths)
}

export { channel, callback }
