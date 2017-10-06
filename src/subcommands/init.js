const Enquirer = require('enquirer')
const fs = require('fs')
const path = require('path')

const closestPath = require('./closestPath.js')

const addUserToConfig = require('./addUserToConfig.js')

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
      fs.writeFileSync(
        path.resolve(response.path, '.gitpair'),
        JSON.stringify({ team: [response.gitpair] }, null, 2)
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
      return addUserToConfig.fromTab(response.path, response.yourAlias)
    })
    .then(function (user) {
      return Object.assign({}, response, {
        gitpair: {
          team: [user]
        }
      })
    })
}
