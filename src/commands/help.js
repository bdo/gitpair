import format from '../utils/format'

const HELP_TEXT = {
  amend: `
  Usage: git pair amend

  Amends a commit and adds co-authorship information.
  `,
  off: `
  Usage: git pair off

  Pauses pairing until you turn it on again.

  See also: ${format.bold('`git pair on`')}
  `,
  on: `
  Usage: git pair on

  Resumes pairing with the previous pair.

  See also: ${format.bold('`git pair off`')}
  `,
  info: `
  Usage: git pair info

  Displays who current pairs or if pairing is disabled.
  `,
  with: `
  Usage: git pair with <list>

  Registers you pairing partners.

  List:
    A space separated list of the aliases of people you are about to be pairing with.
    Aliases are configured in ${format.bold('.gitpair/authors.json')}.
    Gitpair will also match authors with parts of their name or email if unique.

  Examples:

    > git pair with smi
    👥 ${format.dim("you're now pairing with")} ${format.dim(format.bold(`John Smith`))}.

    > git pair with peter paul mary
    👥 ${format.dim("you're now pairing with")} ${format.dim(
    format.bold('Peter Yarrow, Paul Stookey and Mary Travers')
  )}.

    > git pair with
    👤 ${format.dim(`not pairing with anyone`)}

  See also: ${format.bold('`git pair off`')}
    `,
  trailers: `
  Usage: git pair trailers

  Prints the ${format.bold(`'Co-authored-by'`)} trailer message.
  This is useful for your PR's merge commit message 😉

  See also: ${format.bold('`git pair amend`')}
  `,
  version: `
  Usage: git pair version

  Prints the git pair version.
  `,
  help: `
  Usage: git pair help <command>

  Give specific help about a command.
  `,
  usage: `
  Usage: git pair <command>

  Helps you attribute co-authorship of git commits when pair-programming.

  Commands:
    - with
    - info
    - amend
    - off
    - on
    - trailers
    - help
    - version

  Run ${format.bold('`git pair help COMMAND`')} for more information on specific commands.
  Visit ${format.bold('https://github.com/bdo/gitpair')} to learn more about gitpair.
  `,
}

const getHelp = (command) => {
  if (!command) {
    return HELP_TEXT.usage
  }
  const helpText = HELP_TEXT[command]
  if (!helpText) {
    console.error(format.red(`Unknow command ${format.bold(`'${command}'`)}`))
    return HELP_TEXT.usage
  }
  return `${helpText}
  Visit ${format.bold('https://github.com/bdo/gitpair')} for more information about this command.
    `
}

export default (command) => console.info(getHelp(command))
