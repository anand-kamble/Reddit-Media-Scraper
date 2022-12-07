//@ts-check
const { get_subreddit_posts } = require("../api");
const globals = require("../globals");
const channel = "subredditSelected";

const callback = (e, subreddit) => {
  globals.setGlobal("sub_reddit", subreddit);
  globals.setGlobal("postsdata", []);
  globals.setGlobal("numofPostsGot", 0);

  // globals.sub_reddit = subreddit;
  // globals.postsdata = [];
  // globals.postsdata.length = 0;
  // globals.numofPostsGot = 0;
  get_subreddit_posts("", false);
};

module.exports = { channel, callback };
