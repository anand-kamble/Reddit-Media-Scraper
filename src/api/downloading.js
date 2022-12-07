//@ts-check

const request = require("request");
const globals = require("../globals");
const fs = require("fs");
const { logging } = require("../utils");

let total_downloaded_count = globals.total_downloaded_count;

const downloading = (sData, cb) => {
  try {
    let postsData = sData.data;
    if (
      postsData.url.includes("jpg") ||
      postsData.url.includes("png") ||
      postsData.url.includes("gif") ||
      (postsData.url.includes("mp4") && globals.is_download_cancelled == false)
    ) {
      let title;
      const file_count = fs.readdirSync(globals.downloadsfinalPath).length;
      if (globals.do_I_have_to_rename_posts == false) {
        title = postsData.title.replace(/[\\/:*?'"<>|]/g, "");

        let urlsplit = postsData.url.split(".");

        title +=
          "." + urlsplit[urlsplit.length - 1].replace(/[\\/:*?'"<>|]/g, "");
        title = title.replace(/\\|\//g, "");
      }
      if (globals.do_I_have_to_rename_posts == true) {
        let urlsplit = postsData.url.split(".");
        title = globals.sub_reddit + "_" + (file_count + 1);
        title +=
          "." + urlsplit[urlsplit.length - 1].replace(/[\\/:*?'"<>|]/g, "");
        title = title.replace(/\\|\//g, "");
      }

      let path = globals.downloadsfinalPath + "/" + title;
      globals.setGlobal("total_downloaded_count", total_downloaded_count + 1);
      if (
        (globals.is_nsfw_allowed_to_download == true &&
          postsData.is_nsfw == true) ||
        postsData.is_nsfw == false
      ) {
        let file = request(postsData.url);
        file.pipe(fs.createWriteStream(path));
        file.on("end", () => {
          logging(
            "---[Downloaded] : r/" +
              globals.sub_reddit +
              " - " +
              postsData.title
          );
          globals.mainWindow?.webContents.send("downloadedFiles", postsData);
          cb();
        });
      } else {
        cb();
      }
    } else {
      if (
        globals.is_download_cancelled == true &&
        globals.is_cancel_confirm_sent == false
      ) {
        globals.mainWindow?.webContents.send("cancelConfirm");
        globals.is_cancel_confirm_sent = true;
      }
      cb();
    }
  } catch (e) {
    logging(e);
    cb();
  }
};
module.exports = downloading;
