import { bold } from 'chalk'
import pairingConfig from '../config/pairing'
import run from '../utils/run'
import stripCoAuthorship from '../utils/strip-co-authorship'
import log from '../utils/gitpair-prefixed-log'
import coAuthoringTrailers from '../utils/co-authoring-trailers'

export default () => {
  if (process.env.GITPAIR_RUNNING) {
    return
  }

  if (!pairingConfig.enabled) {
    log("👤 As pairing is not enabled, there's nothing to do.")
    return
  }

  if (pairingConfig.coAuthors.length === 0) {
    log("👤 As you're not pairing with anyone, there's nothing to do.")
    return
  }

  const { coAuthors } = pairingConfig
  const trailers = coAuthoringTrailers(coAuthors)
  const rawCommitMessage = stripCoAuthorship(run('git', ['log', '-1', '--pretty=%B']))

  log(bold('Rewriting last commit with the following info:'))
  log(trailers)
  run('git', ['commit', '--amend', `${rawCommitMessage}\n\n${trailers}`], {
    GITPAIR_RUNNING: 1,
  })
  log(bold('👥 Last commit was rewritten! 😎'))
}
