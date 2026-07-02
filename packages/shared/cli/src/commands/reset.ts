import { $ } from 'bun'
import { getAvailableApps, parseAppArg, validateApp } from '../utils/apps'
import { dbMigrate, dbSeed } from './db'
import { dockerDown, dockerUp } from './docker'

/**
 * ✧･ﾟ: *✧･ﾟ:* RESET COMMANDS *:･ﾟ✧*:･ﾟ✧
 *
 * Reset an app's Docker containers and database (◕‿◕✿)
 */

/**
 * Reset an app by stopping containers, removing volumes, and re-initializing
 */
export async function reset(args: string[]) {
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

  console.log(`🔄 Resetting ${appName}...\n`)

  // Stop containers
  console.log('🐳 Stopping containers...')
  await dockerDown(args)

  // Remove volumes
  console.log('\n🗑️  Removing Docker volumes...')
  await $`docker volume rm db-${appName}-data redis-${appName}-data 2>/dev/null || true`
    .quiet()
    .nothrow()

  // Start fresh
  console.log('\n🐳 Starting fresh containers...')
  await dockerUp(args)

  // Wait for DB to be ready
  console.log('\n⏳ Waiting for database...')
  await new Promise((resolve) => setTimeout(resolve, 3000))

  // Run migrations
  console.log('\n🗃️  Running migrations...')
  await dbMigrate(args)

  // Seed database
  console.log('\n🌱 Seeding database...')
  await dbSeed(args)

  console.log(`\n✅ ${appName} has been reset!`)
}
