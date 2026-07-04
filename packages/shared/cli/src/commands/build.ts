import * as path from 'node:path'
import { getAppDir, getAppKind, getAvailableApps, parseAppArg, validateApp } from '../utils/apps'
import { loadEnvFile, run } from '../utils/shell'

/**
 * ✧･ﾟ: *✧･ﾟ:* BUILD COMMAND *:･ﾟ✧*:･ﾟ✧
 *
 * Build an app for production (◕‿◕✿)
 */

/**
 * Build an app for production. Vite apps run `vite build`; headless server apps
 * bundle their entry with `bun build`.
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
  const kind = getAppKind(appName)

  console.log(`📦 Building ${appName} for production...`)

  const command =
    kind === 'vite'
      ? ['bun', '--bun', 'vite', 'build']
      : ['bun', 'build', 'src/index.ts', '--outdir', 'dist', '--target', 'bun']

  await run(command, {
    cwd: appDir,
    env: appEnv,
  })

  console.log(`✅ Build for ${appName} completed!`)
}
