//@ts-check
const { logging } = require("../utils");
const globals = require("../globals");
const request = require("request");
const fs = require("fs");

let afterToken;
let numofPostsGot = 0;

const get_subreddit_posts = (aftertoken, is_final_download) => {
  try {
    let mainURL =
      "https://www.reddit.com/r/" +
      globals.sub_reddit +
      "/.json?limit=100&" +
      globals.sort_type +
      "&after=" +
      aftertoken;
    logging("Generated Main URL : " + mainURL);
    request(mainURL, { json: true }, (err, res, body) => {
      if (err) {
        return logging(`Can't Connect to Reddit.com`);
      }
      if (!err && res.statusCode == 200) {
        processJSON(body, is_final_download);
        afterToken = body.data.after;
      }
    });
  } catch (e) {
    logging(e);
  }
};

const processSearchJSON = (jsonData, query) => {
  try {
    const mainWindow = globals.mainWindow;
    if (jsonData == "{}") {
      logging("No search results from query " + query);
      let searchresults = {
        query: query,
        length: 0,
        kids: [],
      };
      mainWindow?.webContents.send("searchResult", searchresults);
    } else {
      let searchresults = {
        query: query,
        length: jsonData.data.children.length,
        kids: [],
      };
      jsonData.data.children.forEach((subreddit) => {
        let subredditIntro = {
          thumbnail: subreddit.data.icon_img,
          title: subreddit.data.display_name,
          description: subreddit.data.public_description,
          is_nsfw: subreddit.data.over18,
          banner: "",
        };
        if (subreddit.data.banner_background_image !== undefined) {
          subredditIntro.banner =
            subreddit.data.banner_background_image.split("?")[0];
        }
        if (
          subredditIntro.thumbnail == "" ||
          subredditIntro.thumbnail == undefined
        ) {
          subredditIntro.thumbnail = subreddit.data.community_icon;
        }
        if (subredditIntro.description == undefined) {
          subredditIntro.description = "";
        }
        if (subredditIntro.description.length > 115) {
          subredditIntro.description =
            subreddit.data.public_description.substring(0, 115);
          subredditIntro.description += "...";
        }
        // @ts-ignore
        searchresults.kids.push(subredditIntro);
      });
      mainWindow?.webContents.send("searchResult", searchresults);
    }
  } catch (e) {
    logging(e);
  }
};

const processJSON = (jsonData, is_final_download) => {
  try {
    numofPostsGot = numofPostsGot + jsonData.data.children.length;
    logging(`Got ${numofPostsGot} posts till now.`);

    if (jsonData.data.children.length > 0) {
      jsonData.data.children.forEach((post) => {
        let postObj = {
          title: post.data.title,
          url: post.data.url_overridden_by_dest,
          type: "image",
          childrens: [],
        };

        if (post.data.url_overridden_by_dest == undefined) {
          logging("Found a non Media post.");
        } else {
          if (post.data.is_video == false) {
            if (
              !post.data.url_overridden_by_dest.includes("gfycat") &&
              !post.data.url_overridden_by_dest.includes("redgifs")
            ) {
              postObj = {
                title: post.data.title,
                url: post.data.url_overridden_by_dest,
                type: "image",
                id: post.data.name,
                childrens: [],
                is_nsfw: post.data.over_18,
                thumbnail: post.data.thumbnail,
              };
              if (post.data.url_overridden_by_dest.includes("gallery")) {
                if (post.data.media_metadata !== undefined) {
                  postObj.type = "gallery";
                  // @ts-ignore
                  postObj.childrens = Object.keys(post.data.media_metadata);
                } else {
                  postObj.type = "gallery";
                  try {
                    // @ts-ignore
                    postObj.childrens = Object.keys(
                      post.data.crosspost_parent_list[0].media_metadata
                    );
                  } catch (e) {
                    logging("Caught an error\n" + e);
                  }
                }
              }
              if (
                post.data.url_overridden_by_dest.includes("imgur") &&
                !post.data.url_overridden_by_dest.includes("gallery") &&
                !post.data.url_overridden_by_dest.includes("jpg")
              ) {
                if (post.data.url_overridden_by_dest.includes("gifv")) {
                  postObj.url = post.data.url_overridden_by_dest.replace(
                    "gifv",
                    "mp4"
                  );
                  postObj.type = "VideoExternal";
                } else {
                  postObj.type = "gif";
                }
              } else {
                if (
                  post.data.url_overridden_by_dest.includes("/i.redd.it") &&
                  post.data.url_overridden_by_dest.includes("gif")
                ) {
                  postObj.type = "gif";
                }
                if (post.data.url_overridden_by_dest.includes("imgur")) {
                  postObj.type = "image";
                }
              }
              if (postObj.title.length > 65) {
                postObj.title = postObj.title.slice(0, 63) + "...";
              }
              globals.setGlobal("postsdata", [...globals.postsdata, postObj]);
            } else {
              if (post.data.media !== null) {
                postObj = {
                  title: post.data.title,
                  url: post.data.media.oembed.thumbnail_url,
                  type: "VideoExternal",
                  id: post.data.name,
                  childrens: [],
                  is_nsfw: post.data.over_18,
                  thumbnail: post.data.thumbnail,
                };

                if (postObj.url.includes("gfycat")) {
                  postObj.url = postObj.url
                    .replace("-size_restricted.gif", ".mp4")
                    .replace("thumbs", "giant");
                }
                if (postObj.url.includes("redgifs")) {
                  postObj.url = postObj.url.replace("-mobile.jpg", ".mp4");
                }
                if (postObj.title.length > 65) {
                  postObj.title = postObj.title.slice(0, 63) + "...";
                }
                globals.setGlobal("postsdata", [...globals.postsdata, postObj]);
              } else {
              }
            }
          } else {
            postObj = {
              title: post.data.title,
              url: post.data.url_overridden_by_dest,
              type: "Video",
              id: post.data.name,
              childrens: [],
              is_nsfw: post.data.over_18,
              thumbnail: post.data.thumbnail,
            };
            if (postObj.title.length > 65) {
              postObj.title = postObj.title.slice(0, 63) + "...";
            }
            globals.setGlobal("postsdata", [...globals.postsdata, postObj]);
          }
        }
      });
    }
    if (is_final_download == false) {
      globals.mainWindow?.webContents.send(
        "takesubredditdata",
        globals.postsdata
      );
    }

    if (afterToken == null || afterToken == undefined) {
      logging("No after token Reached the end of the Feed");
      logging(
        `Found ${globals.postsdata.length} posts that can be downloaded.  `
      );
    } else {
      if (is_final_download == true) {
        getMore();
      }
    }
  } catch (e) {
    logging(e);
  }
};

function getMore() {
  try {
    logging(numofPostsGot + "--GOT TIll Noew");
    if (numofPostsGot < globals.numberOfPOSTS) {
      logging("Loading more posts");
      logging("Requesting more posts. [aftertoken :" + afterToken + "]");
      get_subreddit_posts(afterToken, true);
    } else {
      createDir(globals.sub_reddit);
      logging(globals.postsdata.length + "--POSTS IN DOWNLOAD QUEUE");
    }
  } catch (e) {
    logging(e);
  }
}

const createDir = (nameofDir) => {
  try {
    globals.downloadsfinalPath = globals.downloadFolder + "/" + nameofDir;
    if (!fs.existsSync(globals.downloadFolder + "/" + nameofDir)) {
      fs.mkdirSync(globals.downloadFolder + "/" + nameofDir);
    }
    for (let i = 0; i < globals.NumberPostsToDownload; i++) {
      var dataforfunction = {
        data: globals.postsdata[i],
        count: i,
      };
      globals.queue?.push(dataforfunction);
    }
  } catch (e) {
    logging(e);
  }
};

module.exports = {
  get_subreddit_posts,
  processSearchJSON,
  processJSON,
};
