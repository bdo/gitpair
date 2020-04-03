import fs from 'fs'
import pairingConfig from '../config/pairing'
import pairingFile from '../config/pairing-file'
import niceJoin from '../utils/nice-join'

export default () => {
  const newPairingConfig = {
    ...pairingConfig,
    enabled: true,
  }
  fs.writeFileSync(pairingFile, JSON.stringify(newPairingConfig, null, 2))
  const names = pairingConfig.coAuthors.map(({ name }) => name)
  console.info(`👥 Now pairing with ${niceJoin(names)}`)
}
