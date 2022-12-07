//@ts-check
const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const path = require("path");
const request = require("request");
const fs = require("fs");
const async = require("async");
//request.defaults({'proxy': proxyUrl});
const config = require("./config.json");
const { logging } = require("./utils");
const globals = require("./globals");

// var downloadFolder =
//   config.downloadpath || process.env.USERPROFILE + "/Downloads";
// var proxy = config.proxy;
// var parallelDownloads = parseInt(config.parallellimit);
// var afterToken;
// var NumberPostsToDownload = 0;
// var numofPostsGot = 0;
// var numberOfPOSTS = 100;
// var postsdata = [];
// var downloadPath = downloadFolder;
// var is_nsfw_allowed_to_download = true;
// var is_download_cancelled = false;
// var is_cancel_confirm_sent = false;
// var sub_reddit,
//   sort_type = "sort=hot";
// var do_I_have_to_rename_posts = true;
// var sort1 = "sort=hot";
// var sort2 = "sort=new";
// var sort3 = "sort=rising";
// var sort4 = "sort=top&t=hour";
// var sort5 = "sort=top&t=day";
// var sort6 = "sort=top&t=week";
// var sort7 = "sort=top&t=month";
// var sort8 = "sort=top&t=year";
// var sort9 = "sort=top&t=all";

// if (downloadFolder == "") {
//   downloadFolder = process.env.USERPROFILE + "/Downloads";
// }
if (globals.proxy !== "") {
  logging("Proxy selected");
  request.defaults({ proxy: globals.proxy });
} else {
  logging("No proxy");
}

// function logging(msg) {
//   var date = Date.now()
//   var log = `[${date}] : ${msg}\n`
//   // console.log(log)
//   fs.appendFileSync("logs.txt", log)
// }

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}
var mainWindow;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    frame: false,
    width: 1280,
    height: 720,
    minWidth: 1280,
    minHeight: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      devTools: true,
      icon: __dirname + "assets/src/logo.ico",
    },
  });
  mainWindow.maximize();
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  globals.setGlobal("mainWindow", mainWindow);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

let moduleFiles = fs.readdirSync(__dirname + "/modules");
for (const file of moduleFiles) {
  const moduleData = require(__dirname + "/modules/" + file);

  ipcMain.on(moduleData.channel, moduleData.callback);
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// ipcMain.on("windowaction", (e, action) => {
//   //logging(action)
//   if (action == 1) {
//     mainWindow.minimize()
//   }
//   if (action == 2) {
//     if (mainWindow.isMaximized()) {
//       mainWindow.restore()
//     } else {
//       mainWindow.maximize()
//     }
//   }
//   if (action == 3) {
//     mainWindow.close()
//   }
// })

// ipcMain.on("givedownloadsfolder", (e, data) => {
//   mainWindow.webContents.send("getdownloadsfolder", downloadFolder)
// })

// ipcMain.on("select-dirs", async (event, arg) => {
//   const result = await dialog.showOpenDialog(mainWindow, {
//     properties: ["openDirectory"],
//   })
//   logging("directories selected", result.filePaths)
//   downloadPath = result.filePaths
//   mainWindow.webContents.send("getdownloadsfolder", result.filePaths)
// })

// ipcMain.on("getFolder", async (e, d) => {
//   const result = await dialog.showOpenDialog(mainWindow, {
//     properties: ["openDirectory"],
//   })
//   mainWindow.webContents.send("takedefaultfolder", result.filePaths)
// })

// ipcMain.on("search", (e, query) => {
//   var url = `https://www.reddit.com/search.json?q=${query.query}&source=recent&type=sr%2Cuser`
//   if (query.safeSearch == false) {
//     url += "&include_over_18=1"
//   }
//   logging('Search for "' + query.query + '" resolved Url = ' + url)
//   request(url, { json: true }, (err, res, body) => {
//     if (err) {
//       return logging(`Can't Connect to Reddit.com`)
//     }
//     if (!err && res.statusCode == 200) {
//       processSearchJSON(body, query)
//     }
//   })
// })

// ipcMain.on("subredditSelected", (e, subreddit) => {
//   sub_reddit = subreddit
//   postsdata = []
//   postsdata.length = 0
//   numofPostsGot = 0
//   get_subreddit_posts("", false)
// })

// ipcMain.on("setSortType", (e, sortType) => {
//   logging("Selected sort Type = " + sortType)
//   sort_type = sortType
//   postsdata = []
//   postsdata.length = 0
//   get_subreddit_posts("", false)
// })

// ipcMain.on("StartDownload", (e, d, is_nsfw_allowed, is_rename_on) => {
//   logging(`NSFW Posts allowed : ${is_nsfw_allowed}`)
//   logging("Starting Download " + d)
//   do_I_have_to_rename_posts = is_rename_on
//   is_cancel_confirm_sent = false
//   is_download_cancelled = false
//   numberOfPOSTS = d
//   total_downloaded_count = 0
//   NumberPostsToDownload = d
//   logging("Clearing Cache")
//   postsdata = []
//   postsdata.length = 0
//   numofPostsGot = 0
//   is_nsfw_allowed_to_download = is_nsfw_allowed
//   get_subreddit_posts("", true)
//   q = async.queue(downloading, parallelDownloads)
//   q.drain(() => {
//     var filesDownloaded = fs.readdirSync(downloadsfinalPath)
//     mainWindow.webContents.send("DownloadFinished", filesDownloaded.length)
//     postsdata = []
//   })
// })

// ipcMain.on("settings", (e, d) => {
//   console.log(d)
//   fs.writeFileSync("./config.json", JSON.stringify(d))
//   downloadFolder = d.downloadpath
//   proxy = d.parallellimit
//   parallelDownloads = d.proxy
// })

// ipcMain.on("canceldownload", (e, d) => {
//   is_download_cancelled = true
//   q.kill()
//   postsdata = []
//   postsdata.length = 0
//   numofPostsGot = 0
//   mainWindow.webContents.send("cancelConfirm")
// })

// function processSearchJSON(jsonData, query) {
//   try {
//     if (jsonData == "{}") {
//       logging("No search results from query " + query);
//       var searchresults = {
//         query: query,
//         length: 0,
//         kids: [],
//       };
//       mainWindow.webContents.send("searchResult", searchresults);
//     } else {
//       var searchresults = {
//         query: query,
//         length: jsonData.data.children.length,
//         kids: [],
//       };
//       jsonData.data.children.forEach((subreddit) => {
//         var subredditIntro = {
//           thumbnail: subreddit.data.icon_img,
//           title: subreddit.data.display_name,
//           description: subreddit.data.public_description,
//           is_nsfw: subreddit.data.over18,
//           banner: "",
//         };
//         if (subreddit.data.banner_background_image !== undefined) {
//           subredditIntro.banner =
//             subreddit.data.banner_background_image.split("?")[0];
//         }
//         if (
//           subredditIntro.thumbnail == "" ||
//           subredditIntro.thumbnail == undefined
//         ) {
//           subredditIntro.thumbnail = subreddit.data.community_icon;
//         }
//         if (subredditIntro.description == undefined) {
//           subredditIntro.description = "";
//         }
//         if (subredditIntro.description.length > 115) {
//           subredditIntro.description =
//             subreddit.data.public_description.substring(0, 115);
//           subredditIntro.description += "...";
//         }
//         searchresults.kids.push(subredditIntro);
//       });
//       mainWindow.webContents.send("searchResult", searchresults);
//     }
//   } catch (e) {
//     logging(e);
//   }
// }

// function getMore() {
//   try {
//     logging(numofPostsGot + "--GOT TIll Noew");
//     if (numofPostsGot < numberOfPOSTS) {
//       logging("Loading more posts");
//       logging("Requesting more posts. [aftertoken :" + afterToken + "]");
//       get_subreddit_posts(afterToken, true);
//     } else {
//       createDir(sub_reddit);
//       logging(postsdata.length + "--POSTS IN DOWNLOAD QUEUE");
//     }
//   } catch (e) {
//     logging(e);
//   }
// }

// function processJSON(jsonData, is_final_download) {
//   try {
//     numofPostsGot = numofPostsGot + jsonData.data.children.length;
//     logging(`Got ${numofPostsGot} posts till now.`);

//     if (jsonData.data.children.length > 0) {
//       jsonData.data.children.forEach((post) => {
//         var postObj = {
//           title: post.data.title,
//           url: post.data.url_overridden_by_dest,
//           type: "image",
//           childrens: [],
//         };

//         if (post.data.url_overridden_by_dest == undefined) {
//           logging("Found a non Media post.");
//         } else {
//           if (post.data.is_video == false) {
//             if (
//               !post.data.url_overridden_by_dest.includes("gfycat") &&
//               !post.data.url_overridden_by_dest.includes("redgifs")
//             ) {
//               postObj = {
//                 title: post.data.title,
//                 url: post.data.url_overridden_by_dest,
//                 type: "image",
//                 id: post.data.name,
//                 childrens: [],
//                 is_nsfw: post.data.over_18,
//                 thumbnail: post.data.thumbnail,
//               };
//               if (post.data.url_overridden_by_dest.includes("gallery")) {
//                 if (post.data.media_metadata !== undefined) {
//                   postObj.type = "gallery";
//                   postObj.childrens = Object.keys(post.data.media_metadata);
//                 } else {
//                   postObj.type = "gallery";
//                   try {
//                     postObj.childrens = Object.keys(
//                       post.data.crosspost_parent_list[0].media_metadata
//                     );
//                   } catch (e) {
//                     logging("Caught an error\n" + e);
//                   }
//                 }
//               }
//               if (
//                 post.data.url_overridden_by_dest.includes("imgur") &&
//                 !post.data.url_overridden_by_dest.includes("gallery") &&
//                 !post.data.url_overridden_by_dest.includes("jpg")
//               ) {
//                 if (post.data.url_overridden_by_dest.includes("gifv")) {
//                   postObj.url = post.data.url_overridden_by_dest.replace(
//                     "gifv",
//                     "mp4"
//                   );
//                   postObj.type = "VideoExternal";
//                 } else {
//                   postObj.type = "gif";
//                 }
//               } else {
//                 if (
//                   post.data.url_overridden_by_dest.includes("/i.redd.it") &&
//                   post.data.url_overridden_by_dest.includes("gif")
//                 ) {
//                   postObj.type = "gif";
//                 }
//                 if (post.data.url_overridden_by_dest.includes("imgur")) {
//                   postObj.type = "image";
//                 }
//               }
//               if (postObj.title.length > 65) {
//                 postObj.title = postObj.title.slice(0, 63) + "...";
//               }
//               postsdata.push(postObj);
//             } else {
//               if (post.data.media !== null) {
//                 postObj = {
//                   title: post.data.title,
//                   url: post.data.media.oembed.thumbnail_url,
//                   type: "VideoExternal",
//                   id: post.data.name,
//                   childrens: [],
//                   is_nsfw: post.data.over_18,
//                   thumbnail: post.data.thumbnail,
//                 };

//                 if (postObj.url.includes("gfycat")) {
//                   postObj.url = postObj.url
//                     .replace("-size_restricted.gif", ".mp4")
//                     .replace("thumbs", "giant");
//                 }
//                 if (postObj.url.includes("redgifs")) {
//                   postObj.url = postObj.url.replace("-mobile.jpg", ".mp4");
//                 }
//                 if (postObj.title.length > 65) {
//                   postObj.title = postObj.title.slice(0, 63) + "...";
//                 }
//                 postsdata.push(postObj);
//               } else {
//               }
//             }
//           } else {
//             postObj = {
//               title: post.data.title,
//               url: post.data.url_overridden_by_dest,
//               type: "Video",
//               id: post.data.name,
//               childrens: [],
//               is_nsfw: post.data.over_18,
//               thumbnail: post.data.thumbnail,
//             };
//             if (postObj.title.length > 65) {
//               postObj.title = postObj.title.slice(0, 63) + "...";
//             }
//             postsdata.push(postObj);
//           }
//         }
//       });
//     }
//     if (is_final_download == false) {
//       mainWindow.webContents.send("takesubredditdata", postsdata);
//     }

//     if (afterToken == null || afterToken == undefined) {
//       logging("No after token Reached the end of the Feed");
//       logging(`Found ${postsdata.length} posts that can be downloaded.  `);
//     } else {
//       if (is_final_download == true) {
//         getMore();
//       }
//     }
//   } catch (e) {
//     logging(e);
//   }
// }

// var q = globals.queue; //async.queue(downloading, parallelDownloads);

// q.drain(() => {
//   var filesDownloaded = fs.readdirSync(downloadsfinalPath);
//   mainWindow.webContents.send("DownloadFinished", filesDownloaded.length);
//   mainWindow.webContents.send("cancelConfirm");
//   // postsdata = [];
//   globals.setGlobal("postsdata", []);
// });

// var downloadsfinalPath = "";

// function createDir(nameofDir) {
//   try {
//     downloadsfinalPath = downloadPath + "/" + nameofDir;
//     if (!fs.existsSync(downloadPath + "/" + nameofDir)) {
//       fs.mkdirSync(downloadPath + "/" + nameofDir);
//     }
//     console.log(`Number of parallels too download ${parallelDownloads}`);
//     console.log("Numberof posts to download = " + NumberPostsToDownload);
//     for (i = 0; i < NumberPostsToDownload; i++) {
//       console.log("added to q");
//       var dataforfunction = {
//         data: postsdata[i],
//         count: i,
//       };
//       q.push(dataforfunction);
//     }
//   } catch (e) {
//     logging(e);
//   }
// }

var total_downloaded_count = 0;
// function downloading(sData, cb) {
//   try {
//     var postsData = sData.data;
//     if (
//       postsData.url.includes("jpg") ||
//       postsData.url.includes("png") ||
//       postsData.url.includes("gif") ||
//       (postsData.url.includes("mp4") && is_download_cancelled == false)
//     ) {
//       var title;
//       if (do_I_have_to_rename_posts == false) {
//         title = postsData.title.replace(/[\\/:*?'"<>|]/g, "");

//         var urlsplit = postsData.url.split(".");

//         title +=
//           "." + urlsplit[urlsplit.length - 1].replace(/[\\/:*?'"<>|]/g, "");
//         title = title.replace(/\\|\//g, "");
//       }
//       if (do_I_have_to_rename_posts == true) {
//         var urlsplit = postsData.url.split(".");
//         title = sub_reddit + "_" + total_downloaded_count;
//         title +=
//           "." + urlsplit[urlsplit.length - 1].replace(/[\\/:*?'"<>|]/g, "");
//         title = title.replace(/\\|\//g, "");
//       }

//       var path = downloadsfinalPath + "/" + title;

//       if (
//         (is_nsfw_allowed_to_download == true && postsData.is_nsfw == true) ||
//         postsData.is_nsfw == false
//       ) {
//         var file = request(postsData.url);
//         console.log(path);
//         file.pipe(fs.createWriteStream(path));
//         file.on("end", () => {
//           logging(
//             "---[Downloaded] : r/" + sub_reddit + " - " + postsData.title
//           );
//           mainWindow.webContents.send("downloadedFiles", postsData);
//           total_downloaded_count++;
//           cb();
//         });
//       } else {
//         cb();
//       }
//     } else {
//       if (is_download_cancelled == true && is_cancel_confirm_sent == false) {
//         mainWindow.webContents.send("cancelConfirm");
//         is_cancel_confirm_sent = true;
//       }
//       cb();
//     }
//   } catch (e) {
//     logging(e);
//     cb();
//   }
// }
