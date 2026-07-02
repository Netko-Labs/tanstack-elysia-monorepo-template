import { $ } from 'bun'
import { getRootDir } from '../utils/shell'

/**
 * ✧･ﾟ: *✧･ﾟ:* CLEAN COMMANDS *:･ﾟ✧*:･ﾟ✧
 *
 * Clean build artifacts from the monorepo (◕‿◕✿)
 */

/**
 * Clean build artifacts from the monorepo
 */
export async function clean() {
  console.log('🧹 Cleaning build artifacts...\n')

  const rootDir = getRootDir()
  const targets = ['node_modules/.cache', '**/dist', '**/.turbo', '**/tsconfig.tsbuildinfo']

  for (const target of targets) {
    console.log(`  Removing: ${target}`)
    await $`rm -rf ${target}`.cwd(rootDir).quiet().nothrow()
  }

  console.log('\n✅ Done! Run `bun install` to reinstall dependencies if needed.')
}
