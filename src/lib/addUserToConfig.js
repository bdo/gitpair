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
      if (err) {
        return reject(err)
      }

      const currentContents = JSON.parse(contents)
      const newContents = {
        team: currentContents.concat(teamMembers)
      }

      fs.writeFile(path, JSON.stringify(newContents, null, 2), function (err) {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  })
}
module.exports.addToFile = addToFile

function fromGithub (enquirer, path, alias) {
  console.log(`Fetching public user information from github for #{username}...`)
  return github.getUser(alias)
    .then(function (githubUser) {
      console.log('...ok')

      const promptEnquirer = new Enquirer()

      return fromPrompt(
        promptEnquirer,
        path,
        {
          name: githubUser.name,
          email: githubUser.email,
          aliases: [githubUser.login]
        }
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
        return fromPrompt(
          enquirer,
          path,
          {
            name: defaults.name || responses.name,
            email: defaults.email || responses.email,
            aliases: defaults.aliases || responses.aliases
          }
        )
      })
  } else {
    return defaults
  }
}
module.exports.fromPrompt = fromPrompt
