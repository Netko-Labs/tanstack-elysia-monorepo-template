import { type StudioConfig, StudioConfigSchema } from '@temp-repo/studio-domain'

const isEnabled = (args: (string | undefined)[]): boolean => {
  return args.every((arg) => arg !== undefined && arg !== '')
}

const studioConfig: StudioConfig = {
  app: {
    dev: process.env.NODE_ENV !== 'production',
    baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
    port: Number(process.env.PORT ?? 3000),
    cors: process.env.CORS?.split(',') ?? [],
    encryptionKey: process.env.ENCRYPTION_KEY ?? '',
  },
  cache: {
    url: process.env.CACHE_URL ?? '',
  },
  db: {
    url: process.env.DATABASE_URL ?? '',
  },
  auth: {
    secret: process.env.AUTH_SECRET,
    emailAndPassword: {
      enabled: false,
    },
    trustedOrigins: process.env.TRUSTED_ORIGINS?.split(',') ?? [],
    socialProviders: {
      github: {
        enabled: isEnabled([process.env.GITHUB_CLIENT_ID, process.env.GITHUB_CLIENT_SECRET]),
        clientId: process.env.GITHUB_CLIENT_ID ?? '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
      },
      google: {
        enabled: isEnabled([process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET]),
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      },
      discord: {
        enabled: isEnabled([process.env.DISCORD_CLIENT_ID, process.env.DISCORD_CLIENT_SECRET]),
        clientId: process.env.DISCORD_CLIENT_ID ?? '',
        clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
      },
    },
  },
}

export const studioEnvConfig = StudioConfigSchema.parse(studioConfig)
