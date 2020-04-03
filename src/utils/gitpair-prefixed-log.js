export default (message) =>
  console.info(
    message
      .split('\n')
      .map((line) => `gitpair > ${line}`)
      .join('\n')
  )
