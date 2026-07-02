import pino from 'pino'
import pretty from 'pino-pretty'

/**
 * ✧･ﾟ: *✧･ﾟ:* TEMP-REPO KAWAII LOGGER *:･ﾟ✧*:･ﾟ✧
 *
 * A logger with attitude! Japanese-style with sass.
 * Pretty in dev, serious in prod (but still cute at heart).
 */

// Kawaii level prefixes with Japanese flair and attitude ψ(｀∇´)ψ
const kawaiiPrefixes: Record<string, string> = {
  fatal: '(;-;) ヤバイ!!', // Yabai!! (This is BAD!)
  error: '(>_<) ダメ!', // Dame! (No good, baka!)
  warn: '(・_・;) チョット...', // Chotto... (Hold up...)
  info: '(◕‿◕) ヨシ!', // Yoshi! (Nice!)
  debug: '(._.) ナルホド~', // Naruhodo~ (I see, I see~)
  trace: '(*^ω^) ミッケ!', // Mikke! (Found ya!)
}

// Color codes for terminal sparkle ✨
const levelColors: Record<string, string> = {
  fatal: '\x1b[41m\x1b[37m', // White on red bg
  error: '\x1b[31m', // Red
  warn: '\x1b[33m', // Yellow
  info: '\x1b[36m', // Cyan
  debug: '\x1b[35m', // Magenta
  trace: '\x1b[90m', // Gray
}

// HTTP status color coding
const getStatusColor = (status: number): string => {
  if (status >= 500) return '\x1b[31m' // Red for 5xx
  if (status >= 400) return '\x1b[33m' // Yellow for 4xx
  if (status >= 300) return '\x1b[36m' // Cyan for 3xx
  if (status >= 200) return '\x1b[32m' // Green for 2xx
  return '\x1b[90m' // Gray for others
}

// HTTP method colors
const methodColors: Record<string, string> = {
  GET: '\x1b[32m', // Green
  POST: '\x1b[34m', // Blue
  PUT: '\x1b[33m', // Yellow
  PATCH: '\x1b[33m', // Yellow
  DELETE: '\x1b[31m', // Red
  HEAD: '\x1b[90m', // Gray
  OPTIONS: '\x1b[90m', // Gray
}

const reset = '\x1b[0m'
const dim = '\x1b[2m'
const bright = '\x1b[1m'

/**
 * Determine if we're in development mode
 */
const isDevelopment = process.env.NODE_ENV !== 'production'

/**
 * Format a value for display with special handling for common fields
 */
function formatValue(key: string, value: unknown): string {
  // Duration: cyan with "ms" suffix
  if (key === 'duration' && typeof value === 'number') {
    const durationColor = value < 100 ? '\x1b[32m' : value < 500 ? '\x1b[33m' : '\x1b[31m' // Green < 100ms, Yellow < 500ms, Red >= 500ms
    return `${durationColor}${value}ms${reset}`
  }
  // Path: bright magenta for visibility
  if (key === 'path' && typeof value === 'string') {
    return `\x1b[95m${value}${reset}` // Bright magenta
  }
  // Status: colorize HTTP status codes
  if (key === 'status' && typeof value === 'number') {
    return `${getStatusColor(value)}${value}${reset}`
  }
  // Method: colorize HTTP methods
  if (key === 'method' && typeof value === 'string') {
    const color = methodColors[value.toUpperCase()] || ''
    return `${color}${value}${reset}`
  }
  // Objects: stringify
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value)
  }
  return String(value)
}

/**
 * Custom kawaii prettifier stream for maximum kawaii energy (◕ᴗ◕✿)
 */
function createKawaiiPrettyStream() {
  return pretty({
    colorize: true,
    ignore: 'pid,hostname',
    messageFormat: (log, messageKey) => {
      const level = pino.levels.labels[log.level as number] || 'info'
      const prefix = kawaiiPrefixes[level] || '(・・)'
      const color = levelColors[level] || ''
      const msg = log[messageKey] as string

      // Build kawaii message with prefix
      let output = `${color}${bright}${prefix}${reset} ${msg}`

      // Add extra fields in a cute way (excluding standard ones)
      const standardKeys = ['level', 'time', 'pid', 'hostname', 'msg', 'name', 'namespace']
      const extraKeys = Object.keys(log).filter((k) => !standardKeys.includes(k))

      if (extraKeys.length > 0) {
        const extras = extraKeys
          .map((key) => `${dim}${key}=${reset}${formatValue(key, log[key])}`)
          .join(' ')
        output += ` ${dim}│${reset} ${extras}`
      }

      return output
    },
    customPrettifiers: {
      // Custom time formatter in Japanese style
      time: (timestamp) => {
        let date: Date

        // Handle various timestamp formats pino might send
        if (timestamp === undefined || timestamp === null) {
          date = new Date()
        } else if (typeof timestamp === 'number') {
          date = new Date(timestamp)
        } else if (typeof timestamp === 'string') {
          // Could be ISO string or epoch as string
          const parsed = Number(timestamp)
          date = Number.isNaN(parsed) ? new Date(timestamp) : new Date(parsed)
        } else {
          date = new Date()
        }

        // Validate the date
        if (Number.isNaN(date.getTime())) {
          date = new Date()
        }

        const timeStr = date.toLocaleTimeString('ja-JP', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
        return `${dim}[${timeStr}]${reset}`
      },
      // Custom level formatter
      level: (level) => {
        const levelNum = typeof level === 'number' ? level : Number(level)
        const levelName = pino.levels.labels[levelNum] || 'info'
        const color = levelColors[levelName] || ''
        return `${color}${levelName.toUpperCase().padEnd(5)}${reset}`
      },
    },
  })
}

/**
 * Create the kawaii logger instance ♪(´ε` )
 *
 * In development: Pretty prints with Japanese flair
 * In production: Standard JSON for log aggregation (still kawaii at heart)
 */
export const logger = isDevelopment
  ? pino(
      {
        level: process.env.LOG_LEVEL || 'debug',
      },
      createKawaiiPrettyStream(),
    )
  : pino({
      level: process.env.LOG_LEVEL || 'info',
      formatters: {
        level: (label: string) => {
          return { level: label, kawaii: kawaiiPrefixes[label] || '(・・)' }
        },
      },
    })

/**
 * Create a child logger with a specific context/namespace
 * Great for module-specific logging! ヾ(＾∇＾)
 *
 * @example
 * const dbLogger = createLogger('database')
 * dbLogger.info('Connected!') // Outputs with [database] prefix
 */
export function createLogger(namespace: string) {
  return logger.child({ namespace: `[${namespace}]` })
}

/**
 * Log levels available:
 *
 * logger.fatal() - (;-;) ヤバイ!!   - System is unusable, panic mode!
 * logger.error() - (>_<) ダメ!     - Error occurred, but we're surviving
 * logger.warn()  - (・_・;) チョット... - Something's off, heads up!
 * logger.info()  - (◕‿◕) ヨシ!     - Normal operations, all good~
 * logger.debug() - (._.) ナルホド~  - Debugging info for the curious
 * logger.trace() - (*^ω^) ミッケ!   - Super detailed, found something!
 */

export default logger
