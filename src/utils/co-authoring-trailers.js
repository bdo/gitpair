import formatEmailAddress from './format-email-address'

export default (authors) => authors.map((author) => `Co-authored-by: ${formatEmailAddress(author)}`).join('\n')
