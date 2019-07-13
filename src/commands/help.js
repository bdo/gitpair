import { bold, red, dim, reset } from 'chalk'

const HELP_TEXT = {
  amend: `
  Usage: gitpair amend

  Amends a commit and adds co-authorship information.
  `,
  off: `
  Usage: gitpair off

  Pauses pairing until you turn it on again.

  See also: ${bold('`git pair on`')}
  `,
  on: `
  Usage: gitpair on

  Resumes pairing with the previous pair.

  See also: ${bold('`git pair off`')}
  `,
  info: `
  Usage: gitpair info

  Displays who current pairs or if pairing is disabled.
  `,
  with: `
  Usage: gitpair with <list>

  Registers you pairing partners.

  List:
    A space separated list of the aliases of people you are about to be pairing with.
    Aliases are configured in ${bold('.gitpair/authors.json')}.
    Gitpair will also match authors with parts of their name or email if unique.

  Examples:

    > gitpair with smi
    👥 ${dim("you're now pairing with")} ${dim(bold(`John Smith`))}.

    > gitpair with peter paul mary
    👥 ${dim("you're now pairing with")} ${dim(bold('Peter Yarrow, Paul Stookey and Mary Travers'))}.

    > gitpair with               
    👤 ${dim(`not pairing with anyone`)}
    
  See also: ${bold('`git pair off`')}
    `,
  trailers: `
  Usage: gitpair trailers

  Prints the ${bold(`'Co-authored-by'`)} trailer message.
  This is useful for your PR's merge commit message 😉

  See also: ${bold('`git pair amend`')}
  `,
  version: `
  Usage: gitpair version

  Prints the gitpair version.
  `,
  help: `
  Usage: gitpair help <command>

  Give specific help about a command.
  `,
  usage: `
  Usage: gitpair <command>

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

  Run ${bold('`gitpair help COMMAND`')} for more information on specific commands.
  Visit ${bold('https://github.com/bdo/gitpair')} to learn more about gitpair.
  `,
}

const getHelp = command => {
  if (!command) {
    return HELP_TEXT.usage
  }
  const helpText = HELP_TEXT[command]
  if (!helpText) {
    console.error(red(`Unknow command ${bold(`'${command}'`)}`))
    return HELP_TEXT.usage
  }
  return `${helpText}
  Visit ${bold('https://github.com/bdo/gitpair')} for more information about this command.
    `
}

export default command => console.log(getHelp(command))
