const globals = require("../globals");
const channel = "windowaction";

const callback = (e, /** @type {number} */ action) => {
  if (action == 1) {
    globals.mainWindow.minimize();
  }
  if (action == 2) {
    if (globals.mainWindow.isMaximized()) {
      globals.mainWindow.restore();
    } else {
      globals.mainWindow.maximize();
    }
  }
  if (action == 3) {
    globals.mainWindow.close();
  }
};

module.exports = { channel, callback };
