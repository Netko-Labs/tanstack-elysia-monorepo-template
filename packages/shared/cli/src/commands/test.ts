import { getAppDir, getAvailableApps, parseAppArg, validateApp } from '../utils/apps'
import { getPackageScope } from '../utils/scope'
import { getRootDir, run } from '../utils/shell'

/**
 * Run unit tests with vitest via turbo
 */
export const test = async (args: string[]) => {
  const appName = parseAppArg(args)
  const watch = args.includes('--watch') || args.includes('-w')
  const coverage = args.includes('--coverage')
  const rootDir = getRootDir()

  const cmd: string[] = ['turbo', 'run', 'test']

  if (appName) {
    if (!validateApp(appName)) {
      console.error(`App "${appName}" not found`)
      console.log(`Available apps: ${getAvailableApps().join(', ')}`)
      process.exit(1)
    }
    const scope = await getPackageScope()
    cmd.push('--filter', `${scope}/${appName}...`)
  }

  // Pass additional flags to vitest
  const extraFlags: string[] = []
  if (watch) extraFlags.push('--watch')
  if (coverage) extraFlags.push('--coverage')

  if (extraFlags.length > 0) {
    cmd.push('--', ...extraFlags)
  }

  await run(cmd, { cwd: rootDir })
}

/**
 * Run e2e tests with Playwright
 */
export const testE2e = async (args: string[]) => {
  const appName = parseAppArg(args)

  if (!appName) {
    console.error('Please specify an app with --app <name>')
    console.log(`Available apps: ${getAvailableApps().join(', ')}`)
    process.exit(1)
  }

  if (!validateApp(appName)) {
    console.error(`App "${appName}" not found`)
    console.log(`Available apps: ${getAvailableApps().join(', ')}`)
    process.exit(1)
  }

  const appDir = getAppDir(appName)
  const headed = args.includes('--headed')
  const ui = args.includes('--ui')
  const debug = args.includes('--debug')

  const cmd: string[] = ['bunx', 'playwright', 'test']
  if (headed) cmd.push('--headed')
  if (ui) cmd.push('--ui')
  if (debug) cmd.push('--debug')

  await run(cmd, { cwd: appDir })
}
