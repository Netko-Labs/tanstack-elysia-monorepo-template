import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { getAppDir, getAvailableApps, parseAppArg, validateApp } from '../utils/apps'
import { loadEnvFile } from '../utils/shell'

/**
 * ✧･ﾟ: *✧･ﾟ:* INFO COMMAND *:･ﾟ✧*:･ﾟ✧
 *
 * Show detailed info about an app (◕‿◕✿)
 */

export const info = async (args: string[]) => {
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
  const envPath = join(appDir, '.env')
  const pkgPath = join(appDir, 'package.json')

  console.log(`\nApp: ${appName}`)
  console.log(`Path: ${appDir}`)

  // Package info
  if (existsSync(pkgPath)) {
    const pkg = await Bun.file(pkgPath).json()
    console.log(`Version: ${pkg.version || 'N/A'}`)
    console.log(`Dependencies: ${Object.keys(pkg.dependencies || {}).length}`)
  }

  // Environment
  if (existsSync(envPath)) {
    const env = loadEnvFile(envPath)
    console.log('\nEnvironment:')
    console.log(`  PORT: ${env.PORT || '3000'}`)
    console.log(`  DATABASE_URL: ${env.DATABASE_URL ? '✓ Set' : '✗ Missing'}`)
    console.log(`  AUTH_SECRET: ${env.AUTH_SECRET ? '✓ Set' : '✗ Missing'}`)
    console.log(`  CACHE_URL: ${env.CACHE_URL ? '✓ Set' : '✗ Missing'}`)
  } else {
    console.log('\nEnvironment: No .env file found')
  }

  // Docker services
  console.log(
    `\nDocker Compose: ${existsSync(join(appDir, 'compose.yml')) ? '✓ Found' : '✗ Not found'}`,
  )
}
