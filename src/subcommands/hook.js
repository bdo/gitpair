const path = require('path')
const fs = require('fs')
const process = require('process')

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
    .then((commitMsg) => {
      return parseCommitAndUpdateGitpair(path.resolve(configPath, '.gitpair'), commitMsg)
    })
    .then(({ team, authors, commitMsg }) => {
      return amendCommit(team, authors, commitMsg)
    })
}

function parseCommitAndUpdateGitpair (configPath, commitMsg) {
  return Promise.all([readJSON(configPath), getAuthorsFullMatch(commitMsg)])
    .then(([gitpair, authors]) => {
      return findNonTeamAuthors(gitpair, authors)
        .then((newAliases) => {
          return handleNewAliases(configPath, newAliases)
        })
        .then(() => {
          return Promise.all([readJSON(configPath), getAuthorsFullMatch(commitMsg)])
        })
    })
    .then(([gitpair, authors]) => {
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
  if (!process.stdout.isTTY) {
    return Promise.resolve()
  }

  return newAliases.reduce((promise, alias) => {
    return promise.then((newAuthors) => {
      return addUserToConfig.fromTag(configPath, alias)
        .then((newAuthor) => {
          return newAuthors.concat(newAuthor)
        })
    })
  }, Promise.resolve([]))
    .then((newAuthors) => {
      return addUserToConfig.addToFile(configPath, newAuthors)
    })
}

function findNonTeamAuthors (gitpair, aliases) {
  const teamAliases = gitpair.team.reduce((teamAliases, member) => {
    return teamAliases.concat(member.aliases)
  }, [])

  return Promise.resolve(aliases.filter((alias) => {
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
  const members = authors.reduce((teamMembers, author) => {
    const teamMember = findTeamMemberByCommitTag(team, author)
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
      .filter((atTag) => typeof atTag === 'string' && atTag.length >= 2)
      .map((atTag) => atTag.slice(1))
  }

  return []
}

function findTeamMemberByCommitTag (team, tag) {
  return team.find((person) => (
    person.githubUsername === tag || person.initials === tag
  ))
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
