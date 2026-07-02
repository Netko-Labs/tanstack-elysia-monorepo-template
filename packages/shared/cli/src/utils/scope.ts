import { join } from 'node:path'
import { getRootDir } from './shell'

export const getPackageScope = async (): Promise<string> => {
  const rootDir = getRootDir()
  const pkgPath = join(rootDir, 'package.json')
  const pkg = await Bun.file(pkgPath).json()
  const name = pkg.name as string
  return name.startsWith('@') ? (name.split('/')[0] ?? '@temp-repo') : '@temp-repo'
}
