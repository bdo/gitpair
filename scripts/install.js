const path = require('path');
const util = require('util');
const fs = require('fs');

const gitPath = getClosestGitPath();

if (!gitPath) {
  throw new Error('gitpair must be installed inside a git repository');
}

if (process.argv[2] == '--uninstall') {
  const hooksFile = path.resolve(path.resolve(gitPath, 'hooks', 'post-commit'));
  console.log('removing %s', hooksFile);
  fs.unlinkSync(hooksFile);
} else {
  const hooksHeader = fs.readFileSync(path.resolve(__dirname, '../hooks/post-commit'), 'utf-8');
  const hooksSource = fs.readFileSync(path.resolve(__dirname, '../lib/index.js'), 'utf-8');
  const hooksFile = path.resolve(gitPath, 'hooks', 'post-commit');
  console.log('writing %s', hooksFile);
  fs.writeFileSync(hooksFile, hooksHeader + hooksSource, { mode: '0777' });
}

function getClosestGitPath(currentPath) {
  currentPath = currentPath || '.';

  const dir = path.join(currentPath, '.git');
  if (fs.existsSync(dir)) {
    return dir;
  }
  const nextPath = path.resolve(currentPath, '..');
  if (nextPath === currentPath) {
    return;
  }
  return getClosestGitPath(nextPath);
}
