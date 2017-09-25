const path = require('path');
const fs = require('fs');

const git = require("./git.js")
const log = require("./log.js")

const USER_HOME = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];


module.exports = (args) => {
  if (process.env.ALREADY_INSIDE_GITPAIR) process.exit(0);

  const configPath = args.path || USER_HOME;
  const team = getTeamMembers(configPath);


  git.readLastCommitMsg((commitMsg) => {
    const authorsTokens = getAuthorsFullMatch(commitMsg);
      .split(/[@|: ]/)
      .filter(isDefined)

    const authors = [...new Set(authorTokens)];
      .map((alias) => findTeamMemberByAlias(team, alias))
      .filter(isDefined);

    if (authors.length > 0) {
      const commitMsgWithoutAuthors = commitMsg
        .slice(authorsFullMatch.length);

      const message = authors
        .map(author => author.aliases[0].toUpperCase())
        .join('|') + ': ' + commitMsgWithoutAuthors;

      const [author, committer] = randomlySelectAuthorAndCommitter(authors)
      log.log('Setting author to %s, and committer to %s', author.name, committer.name);
      git.amendLastCommitMsg(message, author, committer)

    } else {
      log.log('No gitpair authors, leaving commit unchanged.')

    }
  });
}


function randomlySelectAuthorAndCommiter (authors) {
  const randomizedAuthors = shuffle(authors);

  return [
    randomizeAuthors[0],
    randomizeAuthors[randomizeAuthors.length - 1]
  ];
}



function getAuthorsFullMatch(commitMsg) {
  const upperCaseMatch = /^([A-Z]{2,})(?:\|([A-Z]{2,}))*:? /.exec(commitMsg);
  const atSyntaxMatch = /^@(\w{3,})(?: @(\w{3,}))* /.exec(commitMsg);

  return (upperCaseMatch || atSyntaxMatch || [''])[0];
}


function findTeamMemberByAlias(team, alias) {
  return team.find(person => person.aliases.includes(alias.toLowerCase()));
}


function getTeamMembers(configPath) {
  const filename = '.gitpair';
  const file = path.resolve(configPath, filename);

  try {
    const config = readJSON(file);
    return config.team;

  } catch (err) {
    if (err.code === 'ENOENT') {
      error(`Could not find ${file}. Gitpair needs this file to work...`);
      process.exit(0);
    }

    throw err;

  }
}


function readJSON(file) {
  const text = fs.readFileSync(file, 'utf-8');
  return JSON.parse(text);
}



function isDefined(s) {
  return typeof s !== "undefined";
}


function shuffle(array) {
  const clone = array.slice();
  let m = clone.length;

  while (m) {
    const i = Math.floor(Math.random() * m--);
    [clone[m], clone[i]] = [clone[i], clone[m]];
  }

  return clone;
}
