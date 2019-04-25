import { bold, red } from 'chalk'
import * as commands from './commands'

const [, , command, ...args] = process.argv

if (!Object.keys(commands).includes(command)) {
  if (command) {
    console.error(red(`Gitpair doesn't know any ${bold(command)} command!`))
  }
  commands.help()
  process.exit(1)
}

commands[command](...args)
