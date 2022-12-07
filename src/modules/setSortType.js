//@ts-check
const { ipcMain } = require("electron");
const { get_subreddit_posts } = require("../api");
const { logging } = require("../utils");
const globals = require("../globals");
const channel = "setSortType";

const callback = (e, sortType) => {
  logging("Selected sort Type = " + sortType);
  // globals.sort_type = sortType;
  globals.setGlobal("sort_type", sortType);
  // globals.postsdata = [];
  globals.setGlobal("postsdata", []);
  // globals.postsdata.length = 0;
  get_subreddit_posts("", false);
};

module.exports = { channel, callback };
