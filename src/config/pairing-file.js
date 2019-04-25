import path from 'path'
import fs from 'fs'
import { GITPAIR_PAIRING_FILE } from './paths'
import authorsFile from './authors-file'

const configDirectory = path.dirname(authorsFile)
const pairingFilePath = path.join(configDirectory, GITPAIR_PAIRING_FILE)

if (!fs.existsSync(pairingFilePath)) {
  fs.writeFileSync(pairingFilePath, JSON.stringify({ coAuthors: [], enabled: false }))
}

export default pairingFilePath
