import format from './utils/format'
import * as commands from './commands'

const [, , command, ...args] = process.argv

if (!Object.keys(commands).includes(command)) {
  if (command) {
    console.error(format.red(`Gitpair doesn't know any ${format.bold(command)} command!`))
  }
  commands.help()
  process.exit(command ? 1 : 0)
}

commands[command](...args)
