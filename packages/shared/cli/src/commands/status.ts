import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { getAppDir, getAvailableApps } from '../utils/apps'
import { findProcessOnPort, loadEnvFile, runQuiet } from '../utils/shell'

/**
 * ✧･ﾟ: *✧･ﾟ:* STATUS COMMAND *:･ﾟ✧*:･ﾟ✧
 *
 * Show monorepo status (◕‿◕✿)
 */

export const status = async () => {
  console.log('Monorepo Status\n')

  // Check Docker
  const dockerRunning = await runQuiet(['docker', 'info'])
    .then(() => true)
    .catch(() => false)
  console.log(`Docker: ${dockerRunning ? '✓ Running' : '✗ Not running'}`)

  // Check running containers
  if (dockerRunning) {
    const containers = await runQuiet(['docker', 'ps', '--format', '{{.Names}}']).catch(() => '')
    const containerList = containers.trim().split('\n').filter(Boolean)
    console.log(`Containers: ${containerList.length > 0 ? containerList.join(', ') : 'None'}`)
  }

  // List apps and their status
  const apps = getAvailableApps()
  console.log(`\nApps: ${apps.join(', ')}`)

  // Check ports
  for (const app of apps) {
    const envPath = join(getAppDir(app), '.env')
    if (existsSync(envPath)) {
      const env = loadEnvFile(envPath)
      const port = env.PORT || '3000'
      const pid = await findProcessOnPort(Number(port))
      console.log(`  ${app}: Port ${port} ${pid ? `(PID: ${pid})` : '(free)'}`)
    }
  }
}
