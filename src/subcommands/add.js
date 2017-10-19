const Enquirer = require('enquirer')
const path = require('path')

const closestPath = require('../lib/closestPath.js')
const addUserToConfig = require('../lib/addUserToConfig.js')

export default function add (args) {
  const enquirer = new Enquirer()

  return enquirer
    .ask({
      name: 'path',
      type: 'input',
      message: 'Where should the .gitpair file go?',
      default: closestPath.DEFAULT_GITPAIR_PATH
    })
    .then((response) => {
      return askForInformation(response, enquirer)
    })
    .then(function (response) {
      console.log('Adding %s/.gitpair with details you provided', response.path)
      return addUserToConfig.addToFile(
        path.resolve(response.path, '.gitpair'),
        response.members
      )
    })
}

function askForInformation (response, enquirer) {
  return enquirer.ask({
    name: 'githubUsername',
    type: 'input',
    message: 'What is your alias (typically username on github or your initials)'
  })
    .then(function (response) {
      return addUserToConfig.fromTag(response.path, response.githubUsername)
    })
    .then(function (user) {
      return { ...response, members: [user] }
    })
}
