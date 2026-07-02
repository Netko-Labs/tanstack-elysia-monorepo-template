import * as fs from 'node:fs'
import * as path from 'node:path'
import { getRootDir } from './shell'

/**
 * ✧･ﾟ: *✧･ﾟ:* APP UTILITIES *:･ﾟ✧*:･ﾟ✧
 *
 * Helpers for discovering and validating apps (◕‿◕✿)
 */

/**
 * Get list of available apps in the monorepo
 */
export function getAvailableApps(): string[] {
  const rootDir = getRootDir()
  const appsDir = path.join(rootDir, 'apps')

  if (!fs.existsSync(appsDir)) {
    return []
  }

  return fs.readdirSync(appsDir).filter((name) => {
    const appPath = path.join(appsDir, name)
    return fs.statSync(appPath).isDirectory() && fs.existsSync(path.join(appPath, 'package.json'))
  })
}

/**
 * Validate that an app exists
 */
export function validateApp(appName: string): boolean {
  const apps = getAvailableApps()
  return apps.includes(appName)
}

/**
 * Parse --app flag from args
 */
export function parseAppArg(args: string[]): string | null {
  const appIndex = args.indexOf('--app')
  if (appIndex === -1 || appIndex === args.length - 1) {
    return null
  }
  return args[appIndex + 1] ?? null
}

/**
 * Get app directory path
 */
export function getAppDir(appName: string): string {
  return path.join(getRootDir(), 'apps', appName)
}

/**
 * Get app package directory path
 */
export function getAppPackageDir(appName: string): string {
  return path.join(getRootDir(), 'packages', appName)
}

/**
 * Get repository package directory path
 */
export function getRepositoryDir(appName: string): string {
  return path.join(getAppPackageDir(appName), 'repository')
}
