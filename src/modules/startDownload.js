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
  logging("Clearing Cache");
  globals.setGlobal("do_I_have_to_rename_posts", is_rename_on);
  globals.setGlobal("is_cancel_confirm_sent", false);
  globals.setGlobal("is_download_cancelled", false);
  globals.setGlobal("numberOfPOSTS", d);
  globals.setGlobal("total_downloaded_count", 0);
  globals.setGlobal("NumberPostsToDownload", d);
  globals.setGlobal("postsdata", []);
  globals.setGlobal("numofPostsGot", 0);
  globals.setGlobal("is_nsfw_allowed_to_download", is_nsfw_allowed);
  globals.setGlobal(
    "queue",
    async.queue(downloading, globals.parallelDownloads)
  );
  get_subreddit_posts("", true);
  globals.queue?.drain(() => {
    var filesDownloaded = fs.readdirSync(globals.downloadsfinalPath);
    globals.mainWindow?.webContents.send(
      "DownloadFinished",
      filesDownloaded.length
    );
    globals.setGlobal("postsdata", []);
  });
};
module.exports = { channel, callback };
