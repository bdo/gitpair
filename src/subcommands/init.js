const Enquirer = require("enquirer");
const fs = require("fs");
const path = require("path");

const closestPath = require("./closestPath");
const github = require("./gitHub.js");

var enquirer = new Enquirer();
enquirer.register("confirm", require("prompt-confirm"));

module.exports = function init(args) {
  enquirer
    .ask({
      name: "path",
      type: "input",
      message: "Where should the .gitpair file go?",
      default: closestPath.DEFAULT_GITPAIR_PATH
    })
    .then(askForInformation)
    .then(function(response) {
      console.log("Adding %s/.gitpair with details you provided", response.path);
      fs.writeFileSync(
        path.resolve(response.path, ".gitpair"),
        JSON.stringify({ team: [response.gitpair] }, null, 2)
      );
    })
    .then(function() {
      process.exit(0);
    })
}

function askForInformation(response) {
  return enquirer.ask({
    name: "fromGithub",
    type: "confirm",
    message: "Should I import your details form github?",
    default: true
  })
    .then(function(response) {
      console.dir(response)
      if (response.fromGithub === true) {
        return askForGithubUsername(response)
      } else {
        return askForGitpairInformation(response)
      }
    })
    .then(function (gitpair) {
      return Object.assign({}, response, {
        gitpair: gitpair
      });
    });
}

function askForGitpairInformation(response) {
  return askForGitpairTeamAttribute("name", response)
    .then(function (response) { return askForGitpairTeamAttribute("email", response) })
    .then(function (response) { return askForGitpairTeamAttribute("alias", response) })
    .then(function (response) {
      return {
        name: response.name,
        email: response.email,
        alias: [response.alias]
      }
    })
}


function askForGitpairTeamAttribute(attr, response) {
  return enquirer.ask({
    name: attr,
    type: "input",
    message: attr
  })
    .then(function(response) {
      if (response[attr]) {
        return response;
      } else {
        console.log("Cannot leave %s blank", attr);
        console.log();
        return askForGitpairTeamAttribute(attr, response);
      }
    })
}


function askForGithubUsername(response) {
  return enquirer.ask({
    name: "githubUser",
    type: "input",
    message: "What is your github username (ie http://github.com/yourUserName)"
  })
    .then(function(response) {
      console.log("Getting your user information from github...");
      return github.getUser(response.githubUser);
    })
    .then(function (githubUser) {
      console.log("...ok");
      if (!githubUser.email) {
        console.log("I need your github email address, which you may have set to private in your profile.");
        console.log("This is required to ensure that you are properly creditted in your commits.");

        return enquirer.ask({
          name: "githubEmail",
          type: "input",
          message: "What email address do you use for github?"
        })
          .then(function (response) {
            return {
              name: githubUser.name,
              email: response.githubEmail,
              aliases: githubUser.aliases
            };
          });
      }

      return githubUser;
    })
    .catch(function () {
      console.log("...err");
      console.error("Unable to get your github username, please try again");
      console.log();

      return askForGithubUsername(response);
    })
}
