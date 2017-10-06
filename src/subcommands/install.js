const path = require('path')
const fs = require('fs')
const closestPath = require('./closestPath')

module.exports = function install (args) {
  const gitPath = closestPath('.git', '.')

  if (!gitPath) {
    return Promise.reject(
      new Error('gitpair must be installed inside a git repository')
    )
  }

  return pickProcess(args, path.resolve(gitPath, '.git', 'hooks', 'postcommit'))
}

function pickProcess (args, hooksFile) {
  if (args.uninstall) {
    return doUninstall(hooksFile)
  } else {
    return doInstall(hooksFile)
  }
}

function doUninstall (hooksFile) {
  console.log('removing %s', hooksFile)

  return new Promise(function (resolve, reject) {
    fs.unlink(hooksFile, function (err) {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}

function doInstall (hooksFile) {
  console.log('installing %s', hooksFile)

  return readPostCommitTemplate(path.resolve(
    __dirname,
    '..',
    'hooks',
    'post-commit'
  ))
    .then(function (contents) {
      return writePostCommitFile(hooksFile, contents)
    })
}

function readPostCommitTemplate (postCommitTemplatePath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(postCommitTemplatePath, { encoding: 'utf8' }, function (err, data) {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    })
  })
}

function writePostCommitFile (hooksFile, contents) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(hooksFile, contents, { mode: '0777' }, function (err) {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}
