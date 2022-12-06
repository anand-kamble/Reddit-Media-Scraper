const { ipcMain } = require("electron")

const channel = "windowaction"

const callback = (e, action) => {
  //logging(action)
  if (action == 1) {
    mainWindow.minimize()
  }
  if (action == 2) {
    if (mainWindow.isMaximized()) {
      mainWindow.restore()
    } else {
      mainWindow.maximize()
    }
  }
  if (action == 3) {
    mainWindow.close()
  }
}

export { channel, callback }
