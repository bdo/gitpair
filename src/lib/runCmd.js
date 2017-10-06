const exec = require('child_process').exec

const log = require('./log.js')

module.exports = (cmd) => {
  return new Promise(function (resolve, reject) {
    exec(cmd, function (err, stdout, stderr) {
      if (err) {
        if (stderr.length > 0) {
          console.error(stderr)
        }

        log.error(err)
        return reject(err)
      }

      return resolve(stdout.trim())
    })
  })
}
