//@ts-check
const { get_subreddit_posts } = require("../api");
const { logging } = require("../utils");
const globals = require("../globals");
const channel = "setSortType";

const callback = (/** @type {any} */ e, /** @type {string } */ sortType) => {
  logging("Selected sort Type = " + sortType);
  globals.setGlobal("sort_type", sortType);
  globals.setGlobal("postsdata", []);
  get_subreddit_posts("", false);
};

module.exports = { channel, callback };
