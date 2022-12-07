//@ts-check
const config = require("../config.json");
const async = require("async");
class global_values {
  constructor() {
    this.mainWindow = null;
    this.downloadFolder =
      config.downloadpath === ""
        ? process.env.USERPROFILE + "/Downloads"
        : config.downloadpath;
    this.is_download_cancelled = false;
    this.numofPostsGot = 0;
    this.postsdata = [];
    this.parallelDownloads = parseInt(config.parallellimit) || 1;
    this.queue = null; //async.queue(downloading, this.parallelDownloads);
    /**
     * @type {string | null}
     */
    this.sub_reddit = null;
    this.sort_type = "sort=hot";
    this.do_I_have_to_rename_posts = true;
    this.is_download_cancelled = false;
    this.downloadsfinalPath = "";
    this.is_nsfw_allowed_to_download = false;
    this.is_cancel_confirm_sent = false;
    this.parallelDownloads = 1;
    this.NumberPostsToDownload = 0;
    this.numberOfPOSTS = 100;
    this.total_downloaded_count = 0;
    this.proxy = null;
    this.downloadPath = null;
  }

  setGlobal(variableName, value) {
    this[variableName] = value;
  }

  getGlobal(variableName) {
    return this[variableName];
  }
}

const globalValues = new global_values();

module.exports = globalValues;
