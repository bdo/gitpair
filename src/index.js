require('./promisify.js')

const args = require('./parseArgs.js')()

process(args)
  .then(function () {
    process.exit(0)
  })
  .catch(function (err) {
    console.error(err)
    process.exit(1)
  })

function process (args) {
  switch (args.command) {
    case 'init':
      return require('./subcommands/init.js')(args)

    case 'install':
      return require('./subcommands/install.js')(args)

    case 'hook':
      return require('./subcommands/hook.js')(args)
  }
}
