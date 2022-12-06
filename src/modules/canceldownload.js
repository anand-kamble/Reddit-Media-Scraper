const { ipcMain } = require("electron")

const channel = "canceldownload"

const callback = (e, d) => {
  is_download_cancelled = true
  q.kill()
  postsdata = []
  postsdata.length = 0
  numofPostsGot = 0
  mainWindow.webContents.send("cancelConfirm")
}

export { channel, callback }
