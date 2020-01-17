import fs from 'fs'
import pairingFile from './pairing-file'

const pairingConfig = JSON.parse(fs.readFileSync(pairingFile))

export default pairingConfig
