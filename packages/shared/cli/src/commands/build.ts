import * as fs from 'node:fs'
import * as path from 'node:path'
import {
  getAppDir,
  getAppKind,
  getAvailableApps,
  getRepositoryDir,
  parseAppArg,
  validateApp,
} from '../utils/apps'
import { loadEnvFile, run } from '../utils/shell'

/**
 * ✧･ﾟ: *✧･ﾟ:* BUILD COMMAND *:･ﾟ✧*:･ﾟ✧
 *
 * Build an app for production (◕‿◕✿)
 */

/**
 * Build an app for production. Vite apps run `vite build` (Nitro -> .output);
 * headless server apps bundle their entry with `bun build` (-> dist). Both get
 * a self-contained `{out}/migrate/migrate.js` + drizzle folder for Coolify's
 * pre-deployment command.
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

  const outDir = kind === 'vite' ? '.output' : 'dist'
  const command =
    kind === 'vite'
      ? ['bun', '--bun', 'vite', 'build']
      : ['bun', 'build', 'src/index.ts', '--outdir', outDir, '--target', 'bun']

  // A dev NODE_ENV in .env would make Vite emit a development SSR bundle
  await run(command, {
    cwd: appDir,
    env: { ...appEnv, NODE_ENV: 'production' },
  })

  await bundleMigrations(appName, path.join(appDir, outDir))

  console.log(`✅ Build for ${appName} completed!`)
}

async function bundleMigrations(appName: string, outDir: string) {
  const dbDir = path.join(getRepositoryDir(appName), 'src', 'db')
  const entry = path.join(dbDir, 'migrate.ts')
  if (!fs.existsSync(entry)) return

  const migrateOut = path.join(outDir, 'migrate')
  console.log(`🗃️  Bundling migrations into ${path.relative(process.cwd(), migrateOut)}...`)
  await run(['bun', 'build', entry, '--outdir', migrateOut, '--target', 'bun'])
  fs.cpSync(path.join(dbDir, 'drizzle'), path.join(migrateOut, 'drizzle'), { recursive: true })
}
