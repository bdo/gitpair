require('./promisify.js')
const process = require('process')

const args = require('./parseArgs.js')()

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
      return require('./subcommands/add.js')(args)

    case 'install':
      return require('./subcommands/install.js')(args)

    case 'hook':
      return require('./subcommands/hook.js')(args)
  }
}
