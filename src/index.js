import './promisify.js'

import process from 'process'

import parseArgs from './parseArgs.js'

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
      return require('./subcommands/add.js').default(args)

    case 'install':
      return require('./subcommands/install.js').default(args)

    case 'hook':
      return require('./subcommands/hook.js').default(args)
  }
}
