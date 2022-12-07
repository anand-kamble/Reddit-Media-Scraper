//@ts-check
// eslint-disable-next-line no-unused-vars
const { BrowserWindow } = require("electron");
const config = require("../config.json");
class global_values {
  constructor() {
    /**
     * @type {BrowserWindow | null}
     */
    this.mainWindow = null;
    /**
     * @type {string}
     */
    this.downloadFolder =
      config.downloadpath === ""
        ? process.env.USERPROFILE + "/Downloads"
        : config.downloadpath;
    /**
     * @type {boolean}
     */
    this.is_download_cancelled = false;
    /**
     * @type {number}
     */
    this.numofPostsGot = 0;
    this.postsdata = [];
    /**
     * @type {number}
     */
    this.parallelDownloads = parseInt(config.parallellimit) || 1;
    /**
     * @type {async.QueueObject<any> | null}
     */
    this.queue = null;
    /**
     * @type {string | null}
     */
    this.sub_reddit = null;
    /**
     * @type {string}
     */
    this.sort_type = "sort=hot";
    /**
     * @type {string}
     */
    this.downloadsfinalPath = "";
    /**
     * @type {boolean}
     */
    this.do_I_have_to_rename_posts = true;

    /**
     * @type {boolean}
     */
    this.is_download_cancelled = false;

    /**
     * @type {boolean}
     */
    this.is_nsfw_allowed_to_download = false;

    /**
     * @type {boolean}
     */
    this.is_cancel_confirm_sent = false;

    /**
     * @type {number}
     */
    this.parallelDownloads = 1;

    /**
     * @type {number}
     */
    this.NumberPostsToDownload = 0;

    /**
     * @type {number}
     */
    this.numberOfPOSTS = 100;

    /**
     * @type {number}
     */
    this.total_downloaded_count = 0;

    /**
     * @type {string | null}
     */
    this.proxy = null;
    /**
     * @type {string | null}
     */
    this.downloadPath = null;
  }

  /**
   * @param {string} variableName
   * @param {number | string | boolean | BrowserWindow | async.QueueObject<any> | any[]} value
   */
  setGlobal(variableName, value) {
    this[variableName] = value;
  }

  /**
   * @param {string | number} variableName
   */
  getGlobal(variableName) {
    return this[variableName];
  }
}

const globalValues = new global_values();

module.exports = globalValues;
