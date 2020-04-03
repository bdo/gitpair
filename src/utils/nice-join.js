import { bold } from 'chalk'

export default (items) => {
  const boldItems = items.map((item) => bold(item))
  if (items.length === 0) return ''
  if (items.length === 1) return boldItems[0]
  const last = boldItems.slice(-1)
  const previous = boldItems.slice(0, boldItems.length - 1)
  return `${previous.join(', ')} and ${last}`
}
