import { red, bold } from 'chalk'
import niceJoin from './nice-join'
import authorsFile from '../config/authors-file'

export class AuthorNotFound extends Error {
  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, AuthorNotFound)
  }
}

export default (authors, pattern) => {
  const lowerCasePattern = pattern.toLowerCase()

  const matchByEmail = authors.find(({ email }) => email.toLowerCase === lowerCasePattern)
  if (matchByEmail) return matchByEmail

  const matchByAlias = authors.find(({ aliases }) => aliases.find((alias) => alias.toLowerCase() === lowerCasePattern))
  if (matchByAlias) return matchByAlias

  const matchByPartial = authors.filter(
    ({ name, email, aliases }) =>
      name.toLowerCase().includes(lowerCasePattern) ||
      email.toLowerCase().includes(lowerCasePattern) ||
      aliases.find((alias) => alias.toLowerCase().includes(pattern))
  )
  if (!matchByPartial) {
    throw new AuthorNotFound(red(`Could not find a match for author ${pattern}! Check the ${bold(authorsFile)} file!`))
  }
  if (matchByPartial.length > 1) {
    const names = matchByPartial.map(({ name }) => name)
    throw new AuthorNotFound(red(`Ambiguous match for ${pattern}! It matches ${niceJoin(names)}`))
  }
  return matchByPartial[0]
}
