import './promisify.mjs'

import process from 'process'

import parseArgs from './parseArgs.mjs'
import add from './subcommands/add.mjs'
import install from './subcommands/install.mjs'
import hook from './subcommands/hook.mjs'

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
