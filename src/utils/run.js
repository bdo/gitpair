import { execSync } from 'child_process'

export default command =>
  execSync(command)
    .toString()
    .trim()
