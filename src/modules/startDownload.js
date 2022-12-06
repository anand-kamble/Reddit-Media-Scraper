const { ipcMain } = require("electron")

const channel = "StartDownload"

const callback = (e, data) => (e, d, is_nsfw_allowed, is_rename_on) => {
  logging(`NSFW Posts allowed : ${is_nsfw_allowed}`)
  logging("Starting Download " + d)
  do_I_have_to_rename_posts = is_rename_on
  is_cancel_confirm_sent = false
  is_download_cancelled = false
  numberOfPOSTS = d
  total_downloaded_count = 0
  NumberPostsToDownload = d
  logging("Clearing Cache")
  postsdata = []
  postsdata.length = 0
  numofPostsGot = 0
  is_nsfw_allowed_to_download = is_nsfw_allowed
  get_subreddit_posts("", true)
  q = async.queue(downloading, parallelDownloads)
  q.drain(() => {
    var filesDownloaded = fs.readdirSync(downloadsfinalPath)
    mainWindow.webContents.send("DownloadFinished", filesDownloaded.length)
    postsdata = []
  })
}
export { channel, callback }
