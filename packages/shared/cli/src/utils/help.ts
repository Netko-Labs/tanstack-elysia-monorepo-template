/**
 * ✧･ﾟ: *✧･ﾟ:* HELP UTILITIES *:･ﾟ✧*:･ﾟ✧
 *
 * CLI help output (◕‿◕✿)
 */

export const printHelp = () => {
  console.log(`
Monorepo CLI

Usage: bun run repo <command> [options]

Development
  dev --app <name>           Start full dev environment (docker + db + server)
  serve --app <name>         Start dev server only
  build --app <name>         Build for production

Docker
  docker:up --app <name>     Start Docker containers
  docker:down --app <name>   Stop Docker containers

Database
  db:migrate --app <name>    Run database migrations
  db:generate --app <name>   Generate migrations from schema
  db:push --app <name>       Push schema changes (no migration)
  db:seed --app <name>       Seed database with initial data
  db:studio --app <name>     Open Drizzle Studio GUI

Generators
  generate:app               Create a new app
  generate:lib               Create a shared library

Testing
  test [--app <name>]        Run unit tests
  test --watch               Run tests in watch mode
  test --coverage            Run tests with coverage
  test:e2e --app <name>      Run Playwright E2E tests
  test:e2e --headed          Run E2E tests with browser visible
  test:e2e --ui              Open Playwright UI

Utilities
  status                     Show monorepo status (docker, ports, apps)
  info --app <name>          Show detailed app information
  logs --app <name>          View Docker container logs
  logs --app <name> -f       Follow logs in real-time
  logs --service=<name>      View specific service logs
  clean                      Remove build artifacts and caches
  reset --app <name>         Reset app (stop containers, remove volumes, fresh start)

Project
  rename <new-scope>         Rename project scope (e.g., @my-company)
  rename:preview <scope>     Preview rename changes without modifying

Options
  --app, -a <name>           Specify target app
  --help, -h                 Show this help message

Examples
  bun run repo dev --app studio
  bun run repo db:studio --app studio
  bun run repo test --coverage
  bun run repo logs --app studio -f
  bun run repo reset --app studio
`)
}
