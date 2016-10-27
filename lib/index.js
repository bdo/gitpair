if (process.env.ALREADY_INSIDE_GITPAIR) process.exit(0);

readLastCommitMsg(commitMsg => {
  const authorsFullMatch = getAuthorsFullMatch(commitMsg);
  const authorTokens = authorsFullMatch.split(/[@|: ]/).filter(isDefined);
  const uniqueAuthorTokens = [...new Set(authorTokens)];
  const authors = uniqueAuthorTokens.map(findTeamMemberByAlias).filter(isDefined);

  if (authors.length > 0) {
    log("Author's full match: '%s'", authorsFullMatch);
    log("Commit message: %s", commitMsg);
    const commitMsgWithoutAuthors = commitMsg.slice(authorsFullMatch.length);
    log("Message without authors: %s", commitMsgWithoutAuthors);
    const reformattedMessage = authors.map(author => author.aliases[0].toUpperCase()).join('|') + ': ' + commitMsgWithoutAuthors;
    log("Reformatted message: %s", reformattedMessage);
    log('%d author%s: %s', authors.length, authors.length == 1 ? '' : 's', joinInEnglish(authors.map(c => c.name)));
    const authorsInRandomOrder = shuffle(authors);
    const authorsNames = joinInEnglish(authorsInRandomOrder.map(author => author.name));
    let author = authorsInRandomOrder[0];
    let committer = authorsInRandomOrder[0];
    if (authors.length > 1) {
      committer = authorsInRandomOrder[1];
      log('Randomly selected author: %s', author.name);
      log('Randomly selected committer: %s', committer.name);
    }
    runCmd([
      `GIT_COMMITTER_NAME='${escapeQuotesForBash(committer.name)}'`,
      `GIT_COMMITTER_EMAIL='${escapeQuotesForBash(committer.email)}'`,
      'ALREADY_INSIDE_GITPAIR=1',
      'git commit --amend',
      `--message '${escapeQuotesForBash(reformattedMessage)}'`,
      `--author='${escapeQuotesForBash(authorsNames)} <${escapeQuotesForBash(author.email)}>'`
    ].join(' '));
  } else {
    log('No authors in commit message, leaving commit unchanged.')
  }
});

function getAuthorsFullMatch(commitMsg) {
  const upperCaseMatch = /^([A-Z]{2,})(?:\|([A-Z]{2,}))*:? /.exec(commitMsg);
  const atSyntaxMatch = /^@(\w{3,})(?: @(\w{3,}))* /.exec(commitMsg);
  return (upperCaseMatch || atSyntaxMatch || [''])[0];
}

function findTeamMemberByAlias(alias) {
  const team = getTeamMembers();
  return team.find(person => person.aliases.includes(alias.toLowerCase()));
}

function getTeamMembers() {
  const path = require('path');
  var file = path.resolve(getUserHome(), '.gitpair');
  try {
    const config = readJSON(file);
    return config.team;
  } catch (e) {
    if (e.code === 'ENOENT')
      error(`Failed to read ${file}`);
    throw e;
  }
}

function readJSON(file) {
  const fs = require('fs');
  const text = fs.readFileSync(file, 'utf-8');
  return JSON.parse(text);
}

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function escapeQuotesForBash(cmd) {
  return cmd.replace(/'/g, "'\"'\"'");
}

function runCmd(cmd, callback) {
  const exec = require('child_process').exec;
  exec(cmd, (error, stdout, stderr) => {
    if (error !== null) {
      if (stderr.length > 0)
        console.error(stderr);
      error(error);
    }
    if (callback)
      callback(stdout.trim());
  });
}

function joinInEnglish(items) {
  if (items.length == 1)
    return items[0];
  const nearlyAll = items.slice(0, -1);
  const last = items[items.length - 1];
  return require('util').format('%s and %s', nearlyAll.join(', '), last);
}

function isDefined(s) {
  return s != undefined;
}

function readLastCommitMsg(msgCallback) {
  runCmd('git log -1 --pretty=format:%B', msgCallback);
}

function shuffle(array) {
  const clone = array.slice(0);
  let m = clone.length;
  while (m) {
    let i = Math.floor(Math.random() * m--);
    [clone[m], clone[i]] = [clone[i], clone[m]];
  }
  return clone;
}

function log() {
  const [first, ...rest] = arguments;
  console.log('[GITPAIR] ' + first, ...rest)
}

function error() {
  const [first, ...rest] = arguments;
  console.error('[GITPAIR] ERROR: ' + first, ...rest);
  process.exit(1);
}