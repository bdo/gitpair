const path = require('path')
const fs = require('fs')

module.exports = closestPath

module.exports.DEFAULT_GITPAIR_PATH =
  closestPath('package.json', '.') ||
  closestPath('.gitpair', '.') ||
  process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']

function closestPath (containsThis, initialPath) {
  let currentPath = null
  let nextPath = initialPath

  while (currentPath !== nextPath) {
    currentPath = path.resolve(nextPath)

    const toCheck = path.resolve(currentPath, containsThis)
    if (fs.existsSync(toCheck)) {
      return currentPath
    }

    nextPath = path.resolve(currentPath, '..')
  }

  return null
}
