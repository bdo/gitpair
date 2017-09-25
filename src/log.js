module.exports.log = function log() {
  const [first, ...rest] = arguments;
  console.log('[GITPAIR] ' + first, ...rest)
}


module.exports.error = function error() {
  const [first, ...rest] = arguments;
  console.error('[GITPAIR] ERROR: ' + first, ...rest);
  process.exit(1);
}
