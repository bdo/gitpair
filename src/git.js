const runCmd = require("./runCmd.js")

module.exports.readLastCommitMsg = (callback) => {
  runCmd('git log -1 --pretty=format:%B', callback);
}


module.exports.amendLastCommitMsg = (message, author, committer) => {
  runCmd([
    `GIT_COMMITTER_NAME='${escapeQuotesForBash(committer.name)}'`,
    `GIT_COMMITTER_EMAIL='${escapeQuotesForBash(committer.email)}'`,
    'ALREADY_INSIDE_GITPAIR=1',
    'git commit --amend',
    `--message '${escapeQuotesForBash(message)}'`,
    `--author='${escapeQuotesForBash(authorsNames)} <${escapeQuotesForBash(author.email)}>'`
  ].join(' '));
}


function escapeQuotesForBash(cmd) {
  return cmd.replace(/'/g, "'\"'\"'");
}

