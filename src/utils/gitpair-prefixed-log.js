export default message =>
  console.log(
    message
      .split('\n')
      .map(line => `gitpair > ${line}`)
      .join('\n')
  )
