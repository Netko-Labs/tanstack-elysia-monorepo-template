/**
 * ✧･ﾟ: *✧･ﾟ:* SERVER TYPES *:･ﾟ✧*:･ﾟ✧
 *
 * Shared type definitions for server configuration and asset management (◕‿◕✿)
 */

/**
 * Server configuration ヨシ!
 */
export interface ServerConfig {
  port: number
  clientDirectory: string
  serverEntryPoint: string
}

/**
 * Configuration for asset preloading (◕‿◕)
 */
export interface AssetPreloadConfig {
  maxPreloadBytes: number
  includePatterns: RegExp[]
  excludePatterns: RegExp[]
  verbose: boolean
  enableEtag: boolean
  enableGzip: boolean
  gzipMinBytes: number
  gzipMimeTypes: string[]
}

/**
 * Metadata for static assets ✨
 */
export interface AssetMetadata {
  route: string
  size: number
  type: string
}

/**
 * In-memory asset with ETag and Gzip support (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧
 */
export interface InMemoryAsset {
  raw: Uint8Array
  gz?: Uint8Array
  etag?: string
  type: string
  immutable: boolean
  size: number
}

/**
 * Result of static asset preloading process ヨシ!
 */
export interface PreloadResult {
  routes: Record<string, (req: Request) => Response | Promise<Response>>
  loaded: AssetMetadata[]
  skipped: AssetMetadata[]
}
