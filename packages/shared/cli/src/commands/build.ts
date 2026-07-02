import * as path from 'node:path'
import { getAppDir, getAvailableApps, parseAppArg, validateApp } from '../utils/apps'
import { loadEnvFile, run } from '../utils/shell'

/**
 * ✧･ﾟ: *✧･ﾟ:* BUILD COMMAND *:･ﾟ✧*:･ﾟ✧
 *
 * Build an app for production (◕‿◕✿)
 */

/**
 * Build an app for production
 */
export async function build(args: string[]) {
  const appName = parseAppArg(args)

  if (!appName) {
    console.error('❌ Please specify an app with --app <name>')
    console.log(`Available apps: ${getAvailableApps().join(', ')}`)
    process.exit(1)
  }

  if (!validateApp(appName)) {
    console.error(`❌ App "${appName}" not found`)
    console.log(`Available apps: ${getAvailableApps().join(', ')}`)
    process.exit(1)
  }

  const appDir = getAppDir(appName)
  const envFile = path.join(appDir, '.env')
  const appEnv = loadEnvFile(envFile)

  console.log(`📦 Building ${appName} for production...`)

  await run(['bun', '--bun', 'vite', 'build'], {
    cwd: appDir,
    env: appEnv,
  })

  console.log(`✅ Build for ${appName} completed!`)
}
