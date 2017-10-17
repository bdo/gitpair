import * as childProcess from 'child_process'

import * as log from './log.mjs'

export default function runCmd (cmd) {
  return new Promise((resolve, reject) => {
    childProcess.exec(cmd, (err, stdout, stderr) => {
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
