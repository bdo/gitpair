import { spawnSync } from 'child_process'

export default (command, args, env) =>
  spawnSync(command, args, { env: { ...process.env, ...env } })
    .stdout.toString()
    .trim()
