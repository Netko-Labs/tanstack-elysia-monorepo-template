# @temp-repo/cli

Monorepo CLI for managing apps, databases, Docker, and development workflows.

## Installation

The CLI is automatically available when you install the monorepo dependencies.

## Usage

```bash
bun run repo <command> [options]
```

Or use the convenience scripts in the root package.json:

```bash
bun run dev          # Start full dev environment
bun run serve        # Start dev server only
bun run build        # Production build
bun run db:studio    # Open Drizzle Studio
bun run status       # Show monorepo status
```

## Commands

### Development

| Command | Description |
|---------|-------------|
| `dev --app <name>` | Start full dev environment (docker + db + server) |
| `serve --app <name>` | Start dev server only |
| `build --app <name>` | Build for production |

### Docker

| Command | Description |
|---------|-------------|
| `docker:up --app <name>` | Start Docker containers |
| `docker:down --app <name>` | Stop Docker containers |

### Database

| Command | Description |
|---------|-------------|
| `db:migrate --app <name>` | Run database migrations |
| `db:generate --app <name>` | Generate migrations from schema |
| `db:push --app <name>` | Push schema changes (no migration) |
| `db:seed --app <name>` | Seed database with initial data |
| `db:studio --app <name>` | Open Drizzle Studio GUI |

### Generators

| Command | Description |
|---------|-------------|
| `generate:app` | Create a new app |
| `generate:lib` | Create a shared library |

### Testing

| Command | Description |
|---------|-------------|
| `test [--app <name>]` | Run unit tests |
| `test --watch` | Run tests in watch mode |
| `test --coverage` | Run tests with coverage |
| `test:e2e --app <name>` | Run Playwright E2E tests |

### Utilities

| Command | Description |
|---------|-------------|
| `status` | Show monorepo status (docker, ports, apps) |
| `info --app <name>` | Show detailed app information |
| `logs --app <name>` | View Docker container logs |
| `logs -f` | Follow logs in real-time |
| `clean` | Remove build artifacts and caches |
| `reset --app <name>` | Reset app (fresh start) |

### Project

| Command | Description |
|---------|-------------|
| `rename <new-scope>` | Rename project scope (e.g., @my-company) |
| `rename:preview <scope>` | Preview rename changes |

## Examples

```bash
# Start development for studio app
bun run repo dev --app studio

# Open database GUI
bun run repo db:studio --app studio

# Run tests with coverage
bun run repo test --coverage

# Follow Docker logs
bun run repo logs --app studio -f

# Reset app to fresh state
bun run repo reset --app studio

# Create a new app
bun run repo generate:app
```

## Options

| Option | Description |
|--------|-------------|
| `--app, -a <name>` | Specify target app |
| `--help, -h` | Show help message |
