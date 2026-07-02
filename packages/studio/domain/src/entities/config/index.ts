import { z } from 'zod'

const _protoSocialProviderSchema = z.object({
  enabled: z.boolean(),
  clientId: z.string(),
  clientSecret: z.string(),
})

const transformSocialProviderSchema = (data: z.infer<typeof _protoSocialProviderSchema>) => {
  if (!data.clientId || !data.clientSecret) {
    return undefined
  }
  return data
}

const _protoStudioConfigSchema = z.object({
  app: z.object({
    dev: z.boolean().default(false),
    port: z.number().default(3000),
    cors: z.array(z.string()).default(['http://localhost:3000', 'http://localhost:5173']),
    baseUrl: z.string().url(),
    sentryDsn: z.string().optional(),
    encryptionKey: z.string(),
  }),
  cache: z.object({
    url: z.string(),
  }),
  db: z.object({
    url: z.string(),
  }),
  auth: z.object({
    secret: z.string().optional(),
    emailAndPassword: z.object({
      enabled: z.boolean(),
    }),
    trustedOrigins: z.array(z.string()).default(['http://localhost:3000', 'http://localhost:5173']),
    socialProviders: z.object({
      github: _protoSocialProviderSchema.transform(transformSocialProviderSchema).optional(),
      google: _protoSocialProviderSchema.transform(transformSocialProviderSchema).optional(),
      discord: _protoSocialProviderSchema.transform(transformSocialProviderSchema).optional(),
    }),
  }),
})

const studioConfigSuperRefinement = (
  config: z.infer<typeof _protoStudioConfigSchema>,
  ctx: z.RefinementCtx,
) => {
  const enabledProviders = Object.entries(config.auth.socialProviders).filter(
    ([_, value]) => value?.enabled,
  )

  if (enabledProviders.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'At least one authentication provider must be configured (GitHub or Google).',
      path: ['auth', 'socialProviders', 'github', 'google'],
      fatal: true,
    })
  }
}

export const StudioConfigSchema = _protoStudioConfigSchema.superRefine(studioConfigSuperRefinement)
export type StudioConfig = z.infer<typeof StudioConfigSchema>
