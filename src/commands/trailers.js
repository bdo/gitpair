import format from '../utils/format'
import pairingConfig from '../config/pairing'
import clipboardy from 'clipboardy'
import coAuthoringTrailers from '../utils/co-authoring-trailers'

export default () => {
  const { enabled, coAuthors } = pairingConfig
  if (!enabled) {
    console.info("👤 As pairing is not enabled, there's nothing to do.")
    return
  }

  if (coAuthors.length === 0) {
    console.info("👤 As you're not pairing with anyone, there's nothing to do.")
    return
  }

  const trailers = coAuthoringTrailers(coAuthors)
  console.info(trailers)
  clipboardy.writeSync(trailers)
  console.info(format.bold(`👥 Trailer${coAuthors.length > 1 ? 's' : ''} copied to your clipboard!`))
}
