import fs from 'fs'
import authors from '../config/authors'
import findAuthor, { AuthorNotFound } from '../utils/find-author'
import pairingFile from '../config/pairing-file'
import niceJoin from '../utils/nice-join'

export default (...patterns) => {
  try {
    const coAuthors = patterns.flatMap((pattern) => findAuthor(authors, pattern) || [])
    const newPairingConfig = {
      enabled: true,
      coAuthors: coAuthors.map(({ name, email }) => ({ name, email })),
    }
    fs.writeFileSync(pairingFile, JSON.stringify(newPairingConfig, null, 2))
    if (coAuthors.length === 0) {
      console.info('👤 Now not pairing with anyone')
    } else {
      const names = coAuthors.map(({ name }) => name)
      console.info(`👥 Now pairing with ${niceJoin(names)}`)
    }
  } catch (e) {
    if (e instanceof AuthorNotFound) {
      console.error(e.message)
      process.exit(1)
    } else {
      throw e
    }
  }
}
