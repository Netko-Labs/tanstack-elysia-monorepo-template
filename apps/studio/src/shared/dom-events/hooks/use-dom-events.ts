import { useEffect } from 'react'
import type { KeydownHandler, VisibilityHandler } from '../types'

export function useDocumentKeydown(handler: KeydownHandler, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    document.addEventListener('keydown', handler)
    return () => {
      document.removeEventListener('keydown', handler)
    }
  }, [enabled, handler])
}

export function useSyncOnVisible(handler: VisibilityHandler, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handler()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [enabled, handler])
}
