import Enquirer from 'enquirer'
import fs from 'fs'

import github from './github.js'

export function fromTag (path, tag) {
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

export function addToFile (path, teamMembers) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, contents) => {
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

      const newContents = {
        team: team
      }

      const jsonString = JSON.stringify(newContents, null, 2)

      console.log('Updating .gitpair file to the following:')
      console.log(jsonString)

      fs.writeFile(path, jsonString, (err) => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  })
}

function combineMembers (currentTeam, newMember) {
  const matchingIndex = findIndexOfMemberByEmail(currentTeam, newMember.email)
  if (matchingIndex === -1) {
    return currentTeam.concat(newMember)
  } else {
    return currentTeam.map((member, idx) => {
      if (idx === matchingIndex) {
        return { ...member, name: newMember.name, initials: member.initials, githubUsername: member.githubUsername }
      }
      return member
    })
  }
}

function findIndexOfMemberByEmail (members, email) {
  return members.findIndex((member) => {
    return member.email === email
  })
}

export function fromGithub (enquirer, path, githubUsername) {
  console.log(`Fetching public user information from github for ${githubUsername}...`)
  return github.getUser(githubUsername)
    .then((gitpairUser) => {
      console.log('...ok')

      return fromPrompt(
        new Enquirer(),
        path,
        gitpairUser
      )
    })
    .catch(() => {
      console.log('...err')
      console.error('Unable to get your github username, please fill out your teammates information')
      console.log()

      const promptEnquirer = new Enquirer()
      return fromGithub(promptEnquirer, path)
    })
}

export function fromPrompt (enquirer, path, defaults = {}) {
  const REQUIRED_KEYS = ['name', 'email', 'initials', 'githubUsername']
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
          { ...defaults, [firstMissingKey]: responses[firstMissingKey] }
        )
      })
  } else {
    return Promise.resolve(defaults)
  }
}
