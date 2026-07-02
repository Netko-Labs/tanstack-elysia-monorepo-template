import { getRootDir, run } from '../utils/shell'

/**
 * ✧･ﾟ: *✧･ﾟ:* GENERATE COMMANDS *:･ﾟ✧*:･ﾟ✧
 *
 * Wrappers for turbo generators (◕‿◕✿)
 */

/**
 * Generate a new app using turbo gen
 */
export async function generateApp() {
  console.log('🏗️  Starting app generator...')

  await run(['turbo', 'gen', 'app'], {
    cwd: getRootDir(),
  })

  console.log(`
✅ App generated successfully!

Next steps:
1. Run 'bun install' to install dependencies
2. Copy 'apps/<app-name>/sample.env' to 'apps/<app-name>/.env' and configure
3. Run 'bun repo docker:up --app <app-name>' to start Docker containers
4. Run 'bun repo db:migrate --app <app-name>' to run migrations
5. Run 'bun repo dev --app <app-name>' to start the development server
`)
}

/**
 * Generate a new shared library using turbo gen
 */
export async function generateLib() {
  console.log('🏗️  Starting library generator...')

  await run(['turbo', 'gen', 'lib'], {
    cwd: getRootDir(),
  })

  console.log(`
✅ Library generated successfully!

Next steps:
1. Run 'bun install' to install dependencies
2. Start adding your library code in 'packages/shared/<lib-name>/src/'
`)
}
