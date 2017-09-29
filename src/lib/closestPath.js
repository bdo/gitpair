const path = require('path');
const fs = require('fs');

const USER_HOME = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];


function closestPath (fileOrFolder, currentPath) {
  const resolvedPath = path.resolve(currentPath);
  const toCheck = path.resolve(resolvedPath, fileOrFolder);
  if (fs.existsSync(toCheck)) {
    return path.resolve(currentPath);
  }

  const nextPath = path.resolve(resolvedPath, "..")
  if (nextPath === resolvedPath) {
    return;
  }

  return closestPath(fileOrFolder, nextPath)
}


module.exports = closestPath


module.exports.DEFAULT_GITPAIR_PATH =
  closestPath("package.json", ".") ||
  closestPath(".gitpair", ".") ||
  USER_HOME
