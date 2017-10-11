const Enquirer = require('enquirer')
const path = require('path')

const closestPath = require('../lib/closestPath.js')
const addUserToConfig = require('../lib/addUserToConfig.js')

var enquirer = new Enquirer()
enquirer.register('confirm', require('prompt-confirm'))

module.exports = function init (args) {
  return enquirer
    .ask({
      name: 'path',
      type: 'input',
      message: 'Where should the .gitpair file go?',
      default: closestPath.DEFAULT_GITPAIR_PATH
    })
    .then(askForInformation)
    .then(function (response) {
      console.log('Adding %s/.gitpair with details you provided', response.path)
      return addUserToConfig.addToFile(
        path.resolve(response.path, '.gitpair'),
        response.members
      )
    })
}

function askForInformation (response) {
  return enquirer.ask({
    name: 'yourAlias',
    type: 'input',
    message: 'What is your alias (typically username on github or your initials)'
  })
    .then(function (response) {
      return addUserToConfig.fromTag(response.path, response.yourAlias)
    })
    .then(function (user) {
      return Object.assign({}, response, {
        members: [user]
      })
    })
}
