//@ts-check
const { get_subreddit_posts } = require("../api");
const { logging } = require("../utils");
const async = require("async");
const fs = require("fs");
const globals = require("../globals");
const downloading = require("../api/downloading");

const channel = "StartDownload";

const callback = (
  /** @type {any} */ e,
  /** @type {number} number of posts to be scanned. */ d,
  /** @type {boolean} */ is_nsfw_allowed,
  /** @type {boolean} */ is_rename_on
) => {
  logging(`NSFW Posts allowed : ${is_nsfw_allowed}`);
  logging("Starting Download " + d);
  // globals.do_I_have_to_rename_posts = is_rename_on;
  globals.setGlobal("do_I_have_to_rename_posts", is_rename_on);
  // globals.is_cancel_confirm_sent = false;
  globals.setGlobal("is_cancel_confirm_sent", false);
  // globals.is_download_cancelled = false;
  globals.setGlobal("is_download_cancelled", false);
  // globals.numberOfPOSTS = d;
  globals.setGlobal("numberOfPOSTS", d);
  // globals.total_downloaded_count = 0;
  globals.setGlobal("total_downloaded_count", 0);
  // globals.NumberPostsToDownload = d;
  globals.setGlobal("NumberPostsToDownload", d);
  logging("Clearing Cache");
  // globals.postsdata = [];
  // globals.postsdata.length = 0;
  globals.setGlobal("postsdata", []);
  // globals.numofPostsGot = 0;
  globals.setGlobal("numofPostsGot", 0);
  // globals.is_nsfw_allowed_to_download = is_nsfw_allowed;
  globals.setGlobal("is_nsfw_allowed_to_download", is_nsfw_allowed);
  get_subreddit_posts("", true);
  // globals.queue = async.queue(downloading, globals.parallelDownloads);
  globals.setGlobal(
    "queue",
    async.queue(downloading, globals.parallelDownloads)
  );
  globals.queue.drain(() => {
    var filesDownloaded = fs.readdirSync(globals.downloadsfinalPath);
    globals.mainWindow.webContents.send(
      "DownloadFinished",
      filesDownloaded.length
    );
    // globals.mainWindow.webContents.send("cancelConfirm");
    // globals.postsdata = [];
    globals.setGlobal("postsdata", []);
  });
};
module.exports = { channel, callback };
