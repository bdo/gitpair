const runCmd = require('./runCmd.js')

module.exports.readLastCommitMsg = () => {
  return runCmd('git log -1 --pretty=format:%B')
}

module.exports.amendLastCommitMsg = (message, author, committer) => {
  return runCmd([
    `GIT_COMMITTER_NAME='${escapeQuotesForBash(committer.name)}'`,
    `GIT_COMMITTER_EMAIL='${escapeQuotesForBash(committer.email)}'`,
    'ALREADY_INSIDE_GITPAIR=1',
    'git commit --amend',
    `--message '${escapeQuotesForBash(message)}'`,
    `--author='${escapeQuotesForBash(author.names)} <${escapeQuotesForBash(author.email)}>'`
  ].join(' '))
}

function escapeQuotesForBash (cmd) {
  return cmd.replace(/'/g, "'\"'\"'")
}
