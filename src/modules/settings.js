const { ipcMain } = require("electron")

const channel = "settings"

const callback = (e, d) => {
  console.log(d)
  fs.writeFileSync("./config.json", JSON.stringify(d))
  downloadFolder = d.downloadpath
  proxy = d.parallellimit
  parallelDownloads = d.proxy
}
export { channel, callback }
