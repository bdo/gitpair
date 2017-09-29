const path = require('path');
const fs = require('fs');
const closestPath = require("./closestPath")

module.exports = function install(args) {
  const gitPath = closestPath(".git", ".");

  if (!gitPath) {
    throw new Error('gitpair must be installed inside a git repository');
  }

  const hooksFile = path.resolve(path.resolve(gitPath, 'hooks', 'post-commit'));

  if (args.uninstall) {
    console.log('removing %s', hooksFile);
    fs.unlinkSync(hooksFile);
  } else {
    console.log('installing %s', hooksFile);
    const content = fs.readFileSync(path.resolve(__dirname, "..", "hooks", "post-commit"));
    fs.writeFileSync(hooksFile, content, { mode: '0777' });
  }

}
