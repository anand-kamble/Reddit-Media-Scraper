const { ipcMain } = require("electron")

const channel = "subredditSelected"

const callback = (e, subreddit) => {
  sub_reddit = subreddit
  postsdata = []
  postsdata.length = 0
  numofPostsGot = 0
  get_subreddit_posts("", false)
}

export { channel, callback }
