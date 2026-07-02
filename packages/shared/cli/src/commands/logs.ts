import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { getAppDir, getAvailableApps, parseAppArg, validateApp } from '../utils/apps'
import { run } from '../utils/shell'

/**
 * ✧･ﾟ: *✧･ﾟ:* LOGS COMMANDS *:･ﾟ✧*:･ﾟ✧
 *
 * View Docker container logs for an app (◕‿◕✿)
 */

/**
 * View Docker container logs for an app
 */
export async function logs(args: string[]) {
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

  const follow = args.includes('--follow') || args.includes('-f')
  const serviceArg = args.find((a) => a.startsWith('--service='))
  const service = serviceArg?.split('=')[1]
  const tailArg = args.find((a) => a.startsWith('--tail='))
  const tail = tailArg?.split('=')[1] || '100'

  const appDir = getAppDir(appName)
  const composeFile = join(appDir, 'compose.yml')

  if (!existsSync(composeFile)) {
    console.error(`❌ No compose.yml found for ${appName}`)
    process.exit(1)
  }

  const command = ['docker', 'compose', '-f', composeFile, 'logs', `--tail=${tail}`]

  if (follow) {
    command.push('-f')
  }

  if (service) {
    command.push(service)
  }

  console.log(`📋 Showing logs for ${appName}${service ? ` (${service})` : ''}...\n`)

  await run(command)
}
