import { exec } from 'child_process'

import log from './log.js'

export default function runCmd (cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
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
