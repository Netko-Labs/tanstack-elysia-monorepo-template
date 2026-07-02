import { studioEnvConfig } from '@temp-repo/studio-config'
import { account, jwks, session, user, verification } from '@temp-repo/studio-domain'
import { db } from '@temp-repo/studio-repository'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { jwt, lastLoginMethod, magicLink } from 'better-auth/plugins'

export const auth = betterAuth({
  appName: 'Studio',
  baseURL: studioEnvConfig.app.baseUrl,
  basePath: '/api/auth',
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user,
      session,
      account,
      verification,
      jwks,
    },
  }),
  advanced: {
    cookiePrefix: 'studio',
  },
  account: {
    encryptOAuthTokens: true,
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'github', 'discord'],
    },
  },
  plugins: [
    jwt({
      jwt: {
        expirationTime: '1d',
      },
    }),
    magicLink({
      expiresIn: 60 * 10, // 10 minutes
      sendMagicLink: async ({ email, url }) => {
        console.log(`\n✨ Magic Link for ${email}:\n${url}\n`)
      },
    }),
    lastLoginMethod(),
  ],
  ...studioEnvConfig.auth,
})
