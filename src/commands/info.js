import fs from 'fs'
import { dim } from 'chalk'
import pairingConfig from '../config/pairing'
import pairingFile from '../config/pairing-file'
import niceJoin from '../utils/nice-join'

export default () => {
  const { enabled, coAuthors } = pairingConfig
  const names = coAuthors.map(({ name }) => name)
  if (!enabled) {
    console.log('👤 Pairing is currently off!')
    if (coAuthors.length > 0) {
      console.log(dim(`👥 You were previously pairing with ${niceJoin(names)}`))
    }
  } else if (coAuthors.length === 0) {
    console.log('👤 Not currently pairing with anyone')
  } else {
    console.log(`👥 Currently pairing with ${niceJoin(names)}`)
  }
}
