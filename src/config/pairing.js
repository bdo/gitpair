import path from 'path'
import fs from 'fs'
import { bold, red } from 'chalk'
import { GITPAIR_PAIRING_FILE } from './paths'
import pairingFile from './pairing-file'

const pairingConfig = JSON.parse(fs.readFileSync(pairingFile))

export default pairingConfig
