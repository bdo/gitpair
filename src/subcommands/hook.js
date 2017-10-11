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
    })
    .then(function ({ team, authors, commitMsg }) {
      return amendCommit(team, authors, commitMsg)
    })
}

function parseCommitAndUpdateGitpair (configPath, commitMsg) {
  return Promise.all([readJSON(configPath), getAuthorsFullMatch(commitMsg)])
    .then(function ([gitpair, authors]) {
      return findNonTeamAuthors(gitpair, authors)
        .then(function (newAliases) {
          return handleNewAliases(configPath, newAliases)
        })
        .then(function () {
          return Promise.all([readJSON(configPath), getAuthorsFullMatch(commitMsg)])
        })
    })
    .then(function ([gitpair, authors]) {
      return Promise.resolve({
        team: gitpair.team,
        authors: authors,
        commitMsg: commitMsg
      })
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

  return Promise.resolve(aliases.filter(function (alias) {
    return teamAliases.indexOf(alias) === -1
  }))
}

function amendCommit (team, authors, commitMsg) {
  if (authors.length === 0) {
    log.log('No gitpair authors, leaving commit unchanged.')
    return Promise.resolve()
  }

  const message = commitMsg

  const authorAndCommitter = randomlySelectAuthorAndCommitter(team, authors)
  const author = authorAndCommitter.author
  const committer = authorAndCommitter.committer
  log.log(`Setting author to ${author.name}, and committer to ${committer.name}`)

  return git.amendLastCommitMsg(message, author, committer)
}

function randomlySelectAuthorAndCommitter (team, authors) {
  const members = authors.reduce(function (teamMembers, author) {
    const teamMember = findTeamMemberByAlias(team, author)
    if (teamMember) {
      return teamMembers.concat(teamMember)
    }
    return teamMembers
  }, [])
  const randomizedAuthors = shuffle(members)

  return {
    author: randomizedAuthors[0],
    committer: randomizedAuthors[randomizedAuthors.length - 1]
  }
}

function getAuthorsFullMatch (commitMsg) {
  const upperCaseMatch = /^([A-Z]{2,})(?:\|([A-Z]{2,}))*:? /.exec(commitMsg)

  if (upperCaseMatch) {
    return upperCaseMatch[0].split('|')
  }

  const atSyntaxMatch = /^@(\w{3,})(?: @(\w{3,}))* /.exec(commitMsg)

  if (atSyntaxMatch) {
    return atSyntaxMatch[0]
      .split(' ')
      .filter(function (atTag) {
        return typeof atTag === 'string' && atTag.length >= 2
      })
      .map(function (atTag) {
        return atTag.slice(1)
      })
  }

  return []
}

function findTeamMemberByAlias (team, alias) {
  return team.find(function (person) {
    console.log(' >', person.aliases.join(','), alias)
    return person.aliases.indexOf(alias) >= 0
  })
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
