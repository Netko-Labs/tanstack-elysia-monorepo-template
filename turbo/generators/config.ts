import type { PlopTypes } from '@turbo/gen'

/**
 * ✧･ﾟ: *✧･ﾟ:* TURBO GENERATORS *:･ﾟ✧*:･ﾟ✧
 *
 * Custom generators for scaffolding new apps and shared libraries (◕‿◕✿)
 *
 * Available generators:
 * - `turbo gen app` - Create a new app with domain, service, repository, api, and config packages
 * - `turbo gen lib` - Create a new shared library
 */

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // Helper to convert to PascalCase
  plop.setHelper('pascalCase', (text: string) => {
    return text
      .split(/[-_\s]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
  })

  // Helper to convert to camelCase
  plop.setHelper('camelCase', (text: string) => {
    const pascal = text
      .split(/[-_\s]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
    return pascal.charAt(0).toLowerCase() + pascal.slice(1)
  })

  // Helper to convert to CONSTANT_CASE
  plop.setHelper('constantCase', (text: string) => {
    return text
      .split(/[-_\s]+/)
      .map((word) => word.toUpperCase())
      .join('_')
  })

  // Helper to build a Docker Compose "${VAR:-default}:container" port mapping.
  // Written as a helper because "${" + "{{ ... }}" would collide with Handlebars.
  plop.setHelper(
    'dockerPort',
    (name: string, envSuffix: string, hostDefault: string, container: string) => {
      const constant = name
        .split(/[-_\s]+/)
        .map((word) => word.toUpperCase())
        .join('_')
      return `\${${constant}_${envSuffix}:-${hostDefault}}:${container}`
    },
  )

  // ═══════════════════════════════════════════════════════════════════════════
  // APP GENERATOR - Creates a full app with all package layers
  // ═══════════════════════════════════════════════════════════════════════════
  plop.setGenerator('app', {
    description:
      'Create a new application with domain, service, repository, api, and config packages',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the new app?',
        validate: (input: string) => {
          if (!input || input.trim() === '') {
            return 'App name is required'
          }
          if (!/^[a-z][a-z0-9-]*$/.test(input)) {
            return 'App name must start with a letter and contain only lowercase letters, numbers, and hyphens'
          }
          return true
        },
      },
      {
        type: 'list',
        name: 'type',
        message: 'What type of app do you want to create?',
        choices: [
          {
            name: 'Studio — TanStack Start frontend + Elysia (Eden Treaty) HTTP API',
            value: 'studio',
          },
          {
            name: 'Realtime — headless Elysia WebSocket server (presence + chat)',
            value: 'realtime',
          },
        ],
      },
    ],
    actions: (answers) => {
      const appType = (answers?.type as 'studio' | 'realtime') ?? 'studio'
      const actions: PlopTypes.ActionType[] = []

      // Studio => TanStack Start app; Realtime => headless Elysia WebSocket server.
      const templateFolder = appType === 'realtime' ? 'app-realtime' : 'app-tanstack'

      // ─────────────────────────────────────────────────────────────────────────
      // 1. Create the main app in apps/{appName}/
      // ─────────────────────────────────────────────────────────────────────────
      actions.push({
        type: 'addMany',
        destination: '{{ turbo.paths.root }}/apps/{{ name }}',
        base: `templates/${templateFolder}/app`,
        templateFiles: `templates/${templateFolder}/app/**/*`,
        globOptions: { dot: true },
      })

      // ─────────────────────────────────────────────────────────────────────────
      // 2. Create domain package in packages/{appName}/domain/
      // ─────────────────────────────────────────────────────────────────────────
      actions.push({
        type: 'addMany',
        destination: '{{ turbo.paths.root }}/packages/{{ name }}/domain',
        base: `templates/${templateFolder}/domain`,
        templateFiles: `templates/${templateFolder}/domain/**/*`,
        globOptions: { dot: true },
      })

      // ─────────────────────────────────────────────────────────────────────────
      // 3. Create service package in packages/{appName}/service/
      // ─────────────────────────────────────────────────────────────────────────
      actions.push({
        type: 'addMany',
        destination: '{{ turbo.paths.root }}/packages/{{ name }}/service',
        base: `templates/${templateFolder}/service`,
        templateFiles: `templates/${templateFolder}/service/**/*`,
        globOptions: { dot: true },
      })

      // ─────────────────────────────────────────────────────────────────────────
      // 4. Create repository package in packages/{appName}/repository/
      // ─────────────────────────────────────────────────────────────────────────
      actions.push({
        type: 'addMany',
        destination: '{{ turbo.paths.root }}/packages/{{ name }}/repository',
        base: `templates/${templateFolder}/repository`,
        templateFiles: `templates/${templateFolder}/repository/**/*`,
        globOptions: { dot: true },
      })

      // ─────────────────────────────────────────────────────────────────────────
      // 5. Create api (Elysia) package in packages/{appName}/api/
      // ─────────────────────────────────────────────────────────────────────────
      actions.push({
        type: 'addMany',
        destination: '{{ turbo.paths.root }}/packages/{{ name }}/api',
        base: `templates/${templateFolder}/api`,
        templateFiles: `templates/${templateFolder}/api/**/*`,
        globOptions: { dot: true },
      })

      // ─────────────────────────────────────────────────────────────────────────
      // 6. Create config package in packages/configs/{appName}-config/
      // ─────────────────────────────────────────────────────────────────────────
      actions.push({
        type: 'addMany',
        destination: '{{ turbo.paths.root }}/packages/configs/{{ name }}-config',
        base: `templates/${templateFolder}/config`,
        templateFiles: `templates/${templateFolder}/config/**/*`,
        globOptions: { dot: true },
      })

      // ─────────────────────────────────────────────────────────────────────────
      // 7. Update root package.json to add new workspace path
      // ─────────────────────────────────────────────────────────────────────────
      actions.push({
        type: 'modify',
        path: '{{ turbo.paths.root }}/package.json',
        transform: (content: string, answers: { name: string }) => {
          const pkg = JSON.parse(content)
          const newWorkspace = `packages/${answers.name}/*`

          if (!pkg.workspaces.includes(newWorkspace)) {
            // Insert before the last entry to keep order nice
            const insertIndex = pkg.workspaces.length
            pkg.workspaces.splice(insertIndex, 0, newWorkspace)
          }

          return `${JSON.stringify(pkg, null, 2)}\n`
        },
      })

      // ─────────────────────────────────────────────────────────────────────────
      // 8. Update compose.yml to add profile for new app
      // ─────────────────────────────────────────────────────────────────────────
      actions.push({
        type: 'append',
        path: '{{ turbo.paths.root }}/compose.yml',
        pattern: /^services:/m,
        template: `
  # {{ pascalCase name }} App Services
  db-{{ name }}:
    image: postgres:17
    profiles: [{{ name }}]
    ports:
      - "{{{ dockerPort name "DB_PORT" "5433" "5432" }}}"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: {{ name }}
    volumes:
      - {{ name }}_postgres_data:/var/lib/postgresql/data

  redis-{{ name }}:
    image: redis:latest
    profiles: [{{ name }}]
    ports:
      - "{{{ dockerPort name "REDIS_PORT" "6380" "6379" }}}"
    volumes:
      - {{ name }}_redis_data:/data

`,
      })

      // Add volumes for the new app
      actions.push({
        type: 'append',
        path: '{{ turbo.paths.root }}/compose.yml',
        template: `  {{ name }}_postgres_data:
  {{ name }}_redis_data:
`,
      })

      return actions
    },
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // LIB GENERATOR - Creates a new shared library
  // ═══════════════════════════════════════════════════════════════════════════
  plop.setGenerator('lib', {
    description: 'Create a new shared library in packages/shared/',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the new library?',
        validate: (input: string) => {
          if (!input || input.trim() === '') {
            return 'Library name is required'
          }
          if (!/^[a-z][a-z0-9-]*$/.test(input)) {
            return 'Library name must start with a letter and contain only lowercase letters, numbers, and hyphens'
          }
          return true
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'Brief description of the library:',
        default: 'A shared library',
      },
    ],
    actions: [
      // Create the shared library
      {
        type: 'addMany',
        destination: '{{ turbo.paths.root }}/packages/shared/{{ name }}',
        base: 'templates/shared-lib/lib',
        templateFiles: 'templates/shared-lib/lib/**/*',
        globOptions: { dot: true },
      },
    ],
  })
}
