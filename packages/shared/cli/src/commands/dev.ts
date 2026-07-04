import * as path from 'node:path'
import { getAppDir, getAppKind, getAvailableApps, parseAppArg, validateApp } from '../utils/apps'
import { killProcessOnPort, loadEnvFile, run } from '../utils/shell'
import { dbGenerate, dbMigrate } from './db'
import { dockerUp } from './docker'

/**
 * ✧･ﾟ: *✧･ﾟ:* DEV COMMAND *:･ﾟ✧*:･ﾟ✧
 *
 * Run development server for an app (◕‿◕✿)
 */

/**
 * Run full development setup for an app:
 * 1. Start Docker containers
 * 2. Generate DB schema
 * 3. Run migrations
 * 4. Start dev server
 */
export async function dev(args: string[]) {
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

  console.log(`🚀 Starting full development setup for ${appName}...\n`)

  await dockerUp(args)
  await dbGenerate(args)
  await dbMigrate(args)
  await serve(args)
}

/**
 * Run only the development server for an app (without docker/db setup).
 * Vite apps run `vite dev`; headless server apps run `bun --watch src/index.ts`.
 */
export async function serve(args: string[]) {
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

  const port = Number(appEnv.PORT || process.env.PORT || 3000)

  console.log(`🔍 Checking if port ${port} is in use...`)
  await killProcessOnPort(port)

  console.log(`\n🖥️  Starting ${appName} on port ${port}...`)

  const command =
    kind === 'vite' ? ['bun', '--bun', 'vite', 'dev'] : ['bun', 'run', '--watch', 'src/index.ts']

  await run(command, {
    cwd: appDir,
    env: appEnv,
  })
}
