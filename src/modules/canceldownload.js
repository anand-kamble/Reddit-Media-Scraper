//@ts-check
const globals = require("../globals");
const channel = "canceldownload";

const callback = () => {
  globals.setGlobal("is_download_cancelled", true);
  globals.queue?.kill();
  globals.setGlobal("numofPostsGot", 0);
  globals.setGlobal("postsdata", []);
  globals.mainWindow?.webContents.send("cancelConfirm");
};

// export { channel, callback }
module.exports = { channel, callback };
