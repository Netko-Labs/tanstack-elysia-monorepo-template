import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
import { studioEnvConfig } from '@temp-repo/studio-config'

const MASTER_KEY = studioEnvConfig.app.encryptionKey
const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const KEY_BUFFER = Buffer.from(MASTER_KEY, 'hex')

export const encrypt = (text: string) => {
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, KEY_BUFFER, iv)
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
}

export const decrypt = (hash: string) => {
  const [ivHex, authTagHex, encryptedHex] = hash.split(':')

  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error('Invalid encrypted key format.')
  }

  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const encrypted = Buffer.from(encryptedHex, 'hex')

  const decipher = createDecipheriv(ALGORITHM, KEY_BUFFER, iv)
  decipher.setAuthTag(authTag)

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])

  return decrypted.toString('utf8')
}
