import fs from 'fs'
import pairingConfig from '../config/pairing'
import pairingFile from '../config/pairing-file'

export default () => {
  const newPairingConfig = {
    ...pairingConfig,
    enabled: false,
  }
  fs.writeFileSync(pairingFile, JSON.stringify(newPairingConfig, null, 2))
  console.log('👤 Pairing is now off!')
}
