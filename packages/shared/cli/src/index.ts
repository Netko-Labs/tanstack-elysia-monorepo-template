#!/usr/bin/env bun

/**
 * ✧･ﾟ: *✧･ﾟ:* REPO CLI *:･ﾟ✧*:･ﾟ✧
 *
 * A Bun-powered CLI for managing the monorepo! (◕‿◕✿)
 *
 * Usage: bun repo <command> [options]
 */

import { build } from './commands/build'
import { clean } from './commands/clean'
// Database commands
import { dbGenerate, dbMigrate, dbPush, dbSeed, dbStudio } from './commands/db'
// Development commands
import { dev, serve } from './commands/dev'
// Docker commands
import { dockerDown, dockerUp } from './commands/docker'

// Generator commands
import { generateApp, generateLib } from './commands/generate'
import { info } from './commands/info'
import { logs } from './commands/logs'
// Project commands
import { previewRename, renameProject } from './commands/rename'
import { reset } from './commands/reset'
// Utility commands
import { status } from './commands/status'

// Test commands
import { test, testE2e } from './commands/test'
import { printHelp } from './utils/help'

const args = process.argv.slice(2)
const command = args[0]

const commands: Record<string, (args: string[]) => Promise<void>> = {
  // Development
  dev: dev,
  serve: serve,
  build: build,

  // Docker
  'docker:up': dockerUp,
  'docker:down': dockerDown,

  // Database
  'db:migrate': dbMigrate,
  'db:generate': dbGenerate,
  'db:seed': dbSeed,
  'db:push': dbPush,
  'db:studio': dbStudio,

  // Generators
  'generate:app': async () => generateApp(),
  'generate:lib': async () => generateLib(),

  // Utilities
  status: async () => status(),
  info: info,
  clean: async () => clean(),
  reset: reset,
  logs: logs,

  // Testing
  test: test,
  'test:e2e': testE2e,

  // Project
  rename: renameProject,
  'rename:preview': previewRename,
}

const main = async () => {
  if (!command || command === 'help' || command === '--help' || command === '-h') {
    printHelp()
    process.exit(0)
  }

  const handler = commands[command]
  if (!handler) {
    console.error(`Unknown command: ${command}\n`)
    printHelp()
    process.exit(1)
  }

  try {
    await handler(args.slice(1))
  } catch (error) {
    console.error(`Command failed: ${error instanceof Error ? error.message : error}`)
    process.exit(1)
  }
}

main()
