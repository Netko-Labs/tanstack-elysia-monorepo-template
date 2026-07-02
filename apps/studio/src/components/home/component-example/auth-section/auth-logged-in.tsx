import { Badge } from '@temp-repo/ui/components/badge'
import { Button } from '@temp-repo/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@temp-repo/ui/components/card'
import type { AuthLoggedInProps } from './lib'
import {
  AUTH_LOGGED_IN,
  AUTH_LOGGED_IN_BADGE,
  AUTH_LOGGED_IN_DESCRIPTION,
  AUTH_SIGN_OUT,
  AUTH_SIGNING_OUT,
} from './lib'

export function AuthLoggedIn({ session, isLoading, onSignOut }: AuthLoggedInProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {AUTH_LOGGED_IN}
          <Badge variant="default">{AUTH_LOGGED_IN_BADGE}</Badge>
        </CardTitle>
        <CardDescription>{AUTH_LOGGED_IN_DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {session.user.image && (
            <img
              src={session.user.image}
              alt={session.user.name}
              className="h-12 w-12 rounded-full"
            />
          )}
          <div>
            <p className="font-medium">{session.user.name}</p>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
        <Button onClick={onSignOut} variant="outline" disabled={isLoading}>
          {isLoading ? AUTH_SIGNING_OUT : AUTH_SIGN_OUT}
        </Button>
      </CardContent>
    </Card>
  )
}
