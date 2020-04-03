import { dim } from 'chalk'
import pairingConfig from '../config/pairing'
import niceJoin from '../utils/nice-join'

export default () => {
  const { enabled, coAuthors } = pairingConfig
  const names = coAuthors.map(({ name }) => name)
  if (!enabled) {
    console.info('👤 Pairing is currently off!')
    if (coAuthors.length > 0) {
      console.info(dim(`👥 You were previously pairing with ${niceJoin(names)}`))
    }
  } else if (coAuthors.length === 0) {
    console.info('👤 Not currently pairing with anyone')
  } else {
    console.info(`👥 Currently pairing with ${niceJoin(names)}`)
  }
}
