import { bold } from 'chalk'
import pairingConfig from '../config/pairing'
import shuffle from 'lodash/shuffle'
import clipboardy from 'clipboardy'
import coAuthoringTrailers from '../utils/co-authoring-trailers'

export default () => {
  const { enabled, coAuthors } = pairingConfig
  if (!enabled) {
    console.log("👤 As pairing is not enabled, there's nothing to do.")
    return
  }

  if (coAuthors.length === 0) {
    console.log("👤 As you're not pairing with anyone, there's nothing to do.")
    return
  }

  const trailers = coAuthoringTrailers(shuffle(coAuthors))
  console.log(trailers)
  clipboardy.writeSync(trailers)
  console.log(bold(`👥 Trailer${coAuthors.length > 1 ? 's' : ''} copied to your clipboard!`))
}
