const path = require('path')
const fs = require('fs')

const git = require('../lib/git.js')
const log = require('../lib/log.js')
const closestPath = require('../lib/closestPath.js')
const addUserToConfig = require('../lib/addUserToConfig.js')

module.exports = function hook (args) {
  if (process.env.ALREADY_INSIDE_GITPAIR) {
    return Promise.resolve()
  }

  const configPath = args.path || closestPath.DEFAULT_GITPAIR_PATH

  return git.readLastCommitMsg()
    .then(function (commitMsg) {
      return parseCommitAndUpdateGitpair(path.resolve(configPath, '.gitpair'), commitMsg)
        .then(function (team) {
          return Promise.all([commitMsg, team])
        })
    })
    .then(function ([commitMsg, team]) {
      // TODO
    })
}

function parseCommitAndUpdateGitpair (configPath, commitMsg) {
  return Promise.all([readJSON(configPath), getAuthorsFullMatch(commitMsg)])
    .then(function ([gitpair, authors]) {
      console.log("parseCommitAndUpdateGitpair", authors)
      return findNonTeamAuthors(gitpair, authors)
        .then(function (newAliases) {
          return handleNewAliases(configPath, newAliases)
        })
        .then(function () {
          return Promise.all([readJSON(configPath), getAuthorsFullMatch(commitMsg)])
        })
    })
    .then(function ([gitpair, authors]) {
      //
    })
}

function readJSON (file) {
  const text = fs.readFileSync(file, 'utf-8')
  return JSON.parse(text)
}

function handleNewAliases (configPath, newAliases) {
  // TODO: Loop through each alias and prompt for a new author to be added
  // If yes, add that new author to an array
  // If no, do not append initial array
  return newAliases.reduce(function (promise, alias) {
    return promise.then(function (newAuthors) {
      // TODO: Ask to add new alias
      return addUserToConfig.fromTag(configPath, alias)
        .then(function (newAuthor) {
          return newAuthors.concat(newAuthor)
        })
    })
  }, Promise.resolve([]))
    .then(function (newAuthors) {
      return addUserToConfig.addToFile(configPath, newAuthors)
    })
}

function findNonTeamAuthors (gitpair, aliases) {
  const teamAliases = gitpair.team.reduce(function (teamAliases, member) {
    return teamAliases.concat(member.aliases)
  }, [])

  return aliases.filter(function (alias) {
    return teamAliases.indexOf(alias) === -1
  })
}

// function findOnlyTeamAuthors (gitpair, aliases) {
//   const teamAliases = gitpair.team.reduce(function (teamAliases, member) {
//     return teamAliases.concat(member.aliases)
//   }, [])
//
//   return aliases.filter(function (alias) {
//     return teamAliases.indexOf(alias) >= 0
//   })
// }

//
//   git.readLastCommitMsg(function (commitMsg) {
//     const authorsFullMatch =
//       getAuthorsFullMatch(commitMsg)
//
//     const authorTokens =
//       authorsFullMatch
//       .split(/[@|: ]/)
//       .filter(isDefined);
//
//     const authors =
//       authorTokens
//       .reduce(function (memo, token) {
//         if (token && memo.indexOf(token) === -1) {
//           return memo.concat(token)
//         }
//         return memo
//       }, [])
//
//     const authorsOutsideTeam =
//       authors
//       .filter(function (author) { return !authorInTeam(author, team) })
//
//     const authorsInsideTeam =
//       authors
//       .filter(function (author) { return authorInTeam(author, team) })
//
//
//     // TODO: Ask to get their github information, fill in missing emails when necessary
//     let initialPromise = Promise.resolve(authorsInsideTeam)
//     if (authorsOutsideTeam.length > 0) {
//       // Loop through each author, and get their information...
//       initialPromise = authorsOutsideTeam.reduce((promise, authorTag) => {
//         return promise.then((availableAuthors) => {
//           const enquirer = new Enquirer()
//           enquirer.use(require("prompt-confirm"))
//           return enquirer.ask({
//             type: "confirm",
//             name: "addAuthor",
//             message: `#{authorTag} isn't in your team, do you want to add them?`
//           })
//             .then((response) => {
//             })
//         });
//
//       }, initialPromise)
//     } else {
//
//     }
//   });
// }

function amendCommit (authors, authorsFullMatch, commitMsg) {
  if (authors.length > 0) {
    const commitMsgWithoutAuthors =
      commitMsg
        .slice(authorsFullMatch.length)

    const message =
      authors
        .map(function (author) { return author.aliases[0].toUpperCase() })
        .join('|') + ': ' + commitMsgWithoutAuthors

    const authorAndCommitter = randomlySelectAuthorAndCommiter(authors)
    const author = authorAndCommitter[0]
    const committer = authorAndCommitter[1]
    log.log('Setting author to %s, and committer to %s', author.name, committer.name)
    git.amendLastCommitMsg(message, author, committer)

    // TODO: Ask if they want to add any authors not currently in their team to .gitpair
  } else {
    log.log('No gitpair authors, leaving commit unchanged.')
  }
}

function randomlySelectAuthorAndCommiter (authors) {
  const randomizedAuthors = shuffle(authors)

  return {
    author: randomizedAuthors[0],
    commiter: randomizedAuthors[randomizedAuthors.length - 1]
  }
}

function getAuthorsFullMatch (commitMsg) {
  const upperCaseMatch = /^([A-Z]{2,})(?:\|([A-Z]{2,}))*:? /.exec(commitMsg)
  const atSyntaxMatch = /^@(\w{3,})(?: @(\w{3,}))* /.exec(commitMsg)

  console.log("Upper case ------------")
  console.dir(upperCaseMatch)
  console.log("At syntax ------------")
  console.dir(atSyntaxMatch)

  return (upperCaseMatch || atSyntaxMatch || [''])[0]
}

function findTeamMemberByAlias (team, alias) {
  return team.find(person => person.aliases.includes(alias.toLowerCase()))
}

function getTeamMembers (configPath) {
  const filename = '.gitpair'
  const file = path.resolve(configPath, filename)

  try {
    const config = readJSON(file)
    return config.team
  } catch (err) {
    if (err.code === 'ENOENT') {
      log.error(`Could not find ${file}. Gitpair needs this file to work...`)
      process.exit(0)
    }

    throw err
  }
}

function isDefined (s) {
  return typeof s !== 'undefined'
}

function shuffle (array) {
  const clone = array.slice()
  let m = clone.length

  while (m) {
    const i = Math.floor(Math.random() * m--);
    [clone[m], clone[i]] = [clone[i], clone[m]]
  }

  return clone
}
