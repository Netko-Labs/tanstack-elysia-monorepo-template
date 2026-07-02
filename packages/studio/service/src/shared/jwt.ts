import { studioEnvConfig } from '@temp-repo/studio-config'
import { createRemoteJWKSet, jwtVerify } from 'jose'

export async function validateToken(token: string) {
  const jwks = createRemoteJWKSet(new URL(`${studioEnvConfig.app.baseUrl}/api/auth/jwks`))
  const { payload } = await jwtVerify(token, jwks, {
    issuer: studioEnvConfig.app.baseUrl,
    audience: studioEnvConfig.app.baseUrl,
  })
  return payload
}
