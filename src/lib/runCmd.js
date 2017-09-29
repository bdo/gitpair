const exec = require('child_process').exec;

const log = require("./log.js")

module.exports = (cmd, callback) => {
  exec(cmd, (error, stdout, stderr) => {
    if (error !== null) {
      if (stderr.length > 0)
        console.error(stderr);
      log.error(error);
    }
    if (callback)
      callback(stdout.trim());
  });
}
