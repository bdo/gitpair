const packageJson = require("../package.json")

module.exports = () => {
  console.log("gitpair [command]")
  console.log(packageJson.description)
  console.log("v%s", packageJson.version)
  console.log()
  console.log(" install      - Install the git hook")
  console.log(" help         - Show this message")
  console.log(" <no command> - Run the git hook")
  console.log()
  process.exit(0)
}
