const fs = require("fs");

const logging = (msg) => {
  var date = Date.now();
  var log = `[${date}] : ${msg}\n`;
  // console.log(log)
  fs.appendFileSync("logs.txt", log);
};

const nsfw = (/** @type {string} */ title) => {
  const NSFWkeywords = [
    "YXNz",
    "Ym9vYg==",
    "dGl0",
    "c2V4",
    "cG9ybg==",
    "cHVzc3k=",
    "Y3VudA==",
    "ZGljaw==",
  ];
  return NSFWkeywords.some((keyword) =>
    title.includes(Buffer.from(keyword, "base64").toString("ascii"))
  );
};

module.exports = { logging, nsfw };
