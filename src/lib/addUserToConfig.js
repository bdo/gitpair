const Enquirer = require('enquirer')
const fs = require('fs')

const github = require('./gitHub.js')

module.exports.fromTag = function fromTag (path, tag) {
  console.log(`Importing ${tag} into team`)
  const enquirer = new Enquirer()
  enquirer.register('list', require('prompt-list'))

  return enquirer.ask({
    type: 'list',
    name: 'importMethod',
    message: `How should I import ${tag}?`,
    choices: [
      'Github',
      'Manual',
      'Skip'
    ]
  })
    .then(({ importMethod }) => {
      switch (importMethod) {
        case 'Github':
          return fromGithub(enquirer, path, tag)

        case 'Manual':
          return fromPrompt(enquirer, path, {})

        case 'Skip':
          throw new Error('Skipping user')
      }
    })
}

function addToFile (path, teamMembers) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, 'utf8', function (err, contents) {
      let currentContents = { team: [] }

      if (err) {
        console.log('Error reading file, maybe it doesn\'t exist yet.')
      } else {
        try {
          currentContents = JSON.parse(contents)
        } catch (error) {
          console.log(contents)
          console.log(error)
        }
      }

      const team = teamMembers
        .reduce(combineMembers, currentContents.team)
        .map(normalizeMember)

      const newContents = {
        team: team
      }

      const jsonString = JSON.stringify(newContents, null, 2)

      console.log('Updating .gitpair file to the following:')
      console.log(jsonString)

      fs.writeFile(path, jsonString, function (err) {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  })
}
module.exports.addToFile = addToFile

function combineMembers (currentTeam, newMember) {
  const matchingIndex = findIndexOfMemberByEmail(currentTeam, newMember.email)
  if (matchingIndex === -1) {
    return currentTeam.concat(newMember)
  } else {
    return currentTeam.map(function (member, idx) {
      if (idx === matchingIndex) {
        return Object.assign(
          {},
          member,
          {
            name: newMember.name,
            aliases: member.aliases.concat(newMember.aliases)
          }
        )
      }
      return member
    })
  }
}

function normalizeMember (member) {
  return Object.assign(
    {},
    member,
    {
      aliases: member
        .aliases
        .filter(function (alias) {
          return typeof alias === 'string' && alias.length >= 2
        })
        .reduce(uniqArrayReducer, [])
    }
  )
}

function findIndexOfMemberByEmail (members, email) {
  return members.findIndex(function (member) {
    return member.email === email
  })
}

function uniqArrayReducer (uniqued, item) {
  if (uniqued.indexOf(item) === -1) {
    return uniqued.concat(item)
  }
  return uniqued
}

function fromGithub (enquirer, path, alias) {
  console.log(`Fetching public user information from github for ${alias}...`)
  return github.getUser(alias)
    .then(function (gitpairUser) {
      console.log('...ok')

      return fromPrompt(
        new Enquirer(),
        path,
        gitpairUser
      )
    })
    .catch(function () {
      console.log('...err')
      console.error('Unable to get your github username, please fill out your teammates information')
      console.log()

      const promptEnquirer = new Enquirer()
      return fromGithub(promptEnquirer, path)
    })
}
module.exports.fromGithub = fromGithub

function fromPrompt (enquirer, path, defaults = {}) {
  const REQUIRED_KEYS = ['name', 'email', 'aliases']
  const firstMissingKey = REQUIRED_KEYS.find((key) => !defaults[key])
  if (firstMissingKey) {
    return enquirer.ask({
      name: firstMissingKey,
      message: `Enter a ${firstMissingKey}`
    })
      .then((responses) => {
        const value = firstMissingKey === 'aliases'
          ? [responses[firstMissingKey]]
          : responses[firstMissingKey]

        return fromPrompt(
          enquirer,
          path,
          Object.assign({}, defaults, { [firstMissingKey]: value })
        )
      })
  } else {
    return Promise.resolve(defaults)
  }
}
module.exports.fromPrompt = fromPrompt
