const fs = require("fs");

const logging = (msg) => {
  var date = Date.now();
  var log = `[${date}] : ${msg}\n`;
  // console.log(log)
  fs.appendFileSync("logs.txt", log);
};

module.exports = { logging };
