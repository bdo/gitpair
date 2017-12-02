import './promisify.js'

import process from 'process'

import parseArgs from './parseArgs.js'
import add from './subcommands/add.js'
import install from './subcommands/install.js'
import hook from './subcommands/hook.js'

const args = parseArgs()

main(args)
  .then(function () {
    process.exitCode = 0
  })
  .catch(function (err) {
    console.error(err)
    process.exitCode = 1
  })

function main (args) {
  switch (args.command) {
    case 'add':
      return add(args)

    case 'install':
      return install(args)

    case 'hook':
      return hook(args)
  }
}
