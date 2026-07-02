import { type FormEvent, useState } from 'react'
import { signIn, signOut, useSession } from '@/integrations/auth'
import type { AuthMessage } from '../types'
import { AUTH_MAGIC_LINK_ERROR, AUTH_MAGIC_LINK_SUCCESS } from '../values'

export function useAuthSection() {
  const { data: session, isPending } = useSession()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<AuthMessage | null>(null)

  const handleMagicLink = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)
    try {
      const result = await signIn.magicLink({ email })
      if (result.error) {
        setMessage({ type: 'error', text: result.error.message || AUTH_MAGIC_LINK_ERROR })
      } else {
        setMessage({ type: 'success', text: AUTH_MAGIC_LINK_SUCCESS })
        setEmail('')
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : AUTH_MAGIC_LINK_ERROR,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
    } finally {
      setIsLoading(false)
    }
  }

  return { session, isPending, email, setEmail, isLoading, message, handleMagicLink, handleSignOut }
}
