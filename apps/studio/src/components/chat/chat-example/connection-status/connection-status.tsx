import { Badge } from '@temp-repo/ui/components/badge'
import type { ConnectionStatusProps } from '../lib'
import {
  CONNECTION_CONNECTED,
  CONNECTION_CONNECTING,
  CONNECTION_DISCONNECTED,
  CONNECTION_LOGGED_IN_PREFIX,
} from '../lib'

export function ConnectionStatus({ status, userName }: ConnectionStatusProps) {
  const variant =
    status === 'connected' ? 'default' : status === 'connecting' ? 'secondary' : 'destructive'

  const label =
    status === 'connected'
      ? CONNECTION_CONNECTED
      : status === 'connecting'
        ? CONNECTION_CONNECTING
        : CONNECTION_DISCONNECTED

  return (
    <div className="flex items-center gap-2">
      <Badge variant={variant}>{label}</Badge>
      {userName && (
        <Badge variant="outline">
          {CONNECTION_LOGGED_IN_PREFIX} {userName}
        </Badge>
      )}
    </div>
  )
}
