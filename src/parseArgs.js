const ArgParse = require('argparse')

const packageJson = require('../package.json')

module.exports = function parseArgs () {
  const parser = new ArgParse.ArgumentParser({
    name: packageJson.name,
    version: packageJson.version,
    addHelp: true
  })

  const subparsers = parser.addSubparsers({
    dest: 'command'
  })

  createInitSubcommand(subparsers)
  createInstallSubcommand(subparsers)
  createHookSubcommand(subparsers)

  return parser.parseArgs()
}

function createInitSubcommand (subparsers) {
  return subparsers.addParser('init', {
    dest: 'init',
    description: 'Create a local .gitpair file',
    addHelp: true
  })
}

function createInstallSubcommand (subparsers) {
  const install = subparsers.addParser('install', {
    dest: 'install',
    description: 'Install script as a git hook in your .git/hooks directory.',
    addHelp: true
  })

  install.addArgument(['-u', '--uninstall'], {
    nargs: 0,
    help: 'Remove the .git/hook/post-commit script.'
  })

  createPathArgument(install)

  return install
}

function createHookSubcommand (subparsers) {
  const hook = subparsers.addParser('hook', {
    dest: 'hook',
    description: 'Run the git hook commit transformer.',
    addHelp: true
  })

  createPathArgument(hook)

  return hook
}

function createPathArgument (parser) {
  parser.addArgument(['-p', '--path'], {
    help: 'Set the path of .gitpair. Defaults to the directory containing your package.json, or your home directory.'
  })

  return parser
}
