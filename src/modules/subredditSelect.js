//@ts-check
const { get_subreddit_posts } = require("../api");
const globals = require("../globals");
const channel = "subredditSelected";

const callback = (
  /** @type {any} */ e,
  /** @type {string | number | boolean | any[] | Electron.CrossProcessExports.BrowserWindow | async.QueueObject<any>} */ subreddit
) => {
  globals.setGlobal("sub_reddit", subreddit);
  globals.setGlobal("postsdata", []);
  globals.setGlobal("numofPostsGot", 0);
  get_subreddit_posts("", false);
};

module.exports = { channel, callback };
