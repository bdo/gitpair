const path = require('path');
const fs = require('fs');

const git = require("../lib/git.js")
const github = require("../lib/github.js")
const log = require("../lib/log.js")
const closestPath = require("../lib/closestPath.js")


module.exports = (args) => {
  if (process.env.ALREADY_INSIDE_GITPAIR) process.exit(0);

  const configPath = args.path || closestPath.DEFAULT_GITPAIR_PATH;
  const team = getTeamMembers(configPath);

  git.readLastCommitMsg(function (commitMsg) {
    const authorTokens =
      getAuthorsFullMatch(commitMsg)
      .split(/[@|: ]/)
      .filter(isDefined);

    const authors =
      authorTokens
      .reduce(function (memo, token) {
        if (token && memo.indexOf(token) === -1) {
          return memo.concat(token)
        }
        return memo
      }, [])

    const authorsOutsideTeam =
      authors
      .filter(function (author) { return !authorInTeam(author, team) })

    // TODO: Ask to get their github information, fill in missing emails when necessary

    if (authors.length > 0) {
      const commitMsgWithoutAuthors =
        commitMsg
        .slice(authorsFullMatch.length);

      const message =
        authors
        .map(function (author) { return author.aliases[0].toUpperCase() })
        .join('|') + ': ' + commitMsgWithoutAuthors;

      const authorAndCommitter = randomlySelectAuthorAndCommiter(authors);
      const author = authorAndCommitter[0];
      const committer = authorAndCommitter[1];
      log.log('Setting author to %s, and committer to %s', author.name, committer.name);
      git.amendLastCommitMsg(message, author, committer)

      // TODO: Ask if they want to add any authors not currently in their team to .gitpair

    } else {
      log.log('No gitpair authors, leaving commit unchanged.')

    }
  });
}


function authorInTeam (author, team) {
  return team.find(function (member) {
    return member.aliases.indexOf(author) >= 0;
  })
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
      log.error(`Could not find ${file}. Gitpair needs this file to work...`);
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
