import { spawnSync } from 'child_process'

export default (command, ...params) => spawnSync(command, params).stdout.toString().trim()
