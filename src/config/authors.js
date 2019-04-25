import fs from 'fs'
import authorsFile from './authors-file'

const authors = JSON.parse(fs.readFileSync(authorsFile))

export default authors
