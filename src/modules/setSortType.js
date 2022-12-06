const { ipcMain } = require("electron")

const channel = "setSortType"

const callback = (e, sortType) => {
  logging("Selected sort Type = " + sortType)
  sort_type = sortType
  postsdata = []
  postsdata.length = 0
  get_subreddit_posts("", false)
}

export { channel, callback }
