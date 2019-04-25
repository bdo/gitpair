import fs from 'fs'
import path from 'path'

const closestPath = (file, directory = '.') => {
  const currentPath = path.join(directory, file)
  if (fs.existsSync(currentPath)) return path.resolve(currentPath)

  const parentDirectory = path.resolve(directory, '..')

  if (parentDirectory === directory) return null

  return closestPath(file, parentDirectory)
}

export default closestPath
