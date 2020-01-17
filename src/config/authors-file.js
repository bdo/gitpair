import path from 'path'
import fs from 'fs'
import { homedir } from 'os'
import { red } from 'chalk'
import closestPath from '../utils/closest-path'
import { GITPAIR_DIR, GITPAIR_AUTHORS_FILE } from './paths'

const findAuthorsFilePath = () => {
  const authorsFilePath = path.join(GITPAIR_DIR, GITPAIR_AUTHORS_FILE)
  const closest = closestPath(authorsFilePath)
  if (closest) {
    return closest
  }
  const homeDirectory = homedir()
  const homeAuthorsFilePath = path.join(homeDirectory, authorsFilePath)
  return fs.existsSync(homeAuthorsFilePath) && homeAuthorsFilePath
}

const authorsFile = findAuthorsFilePath()

if (!authorsFile) {
  console.error(red(`Gitpair could not find the ${GITPAIR_AUTHORS_FILE} file!`))
  console.error(red('See instructions at https://github.com/bdo/gitpair'))
  process.exit(1)
}

export default authorsFile
