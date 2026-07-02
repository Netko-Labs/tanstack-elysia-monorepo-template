import { Badge } from '@temp-repo/ui/components/badge'
import { Button } from '@temp-repo/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@temp-repo/ui/components/card'
import { Input } from '@temp-repo/ui/components/input'
import type { AuthGuestFormProps } from './lib'
import {
  AUTH_DEV_HINT,
  AUTH_EMAIL_LABEL,
  AUTH_EMAIL_PLACEHOLDER,
  AUTH_GUEST,
  AUTH_GUEST_BADGE,
  AUTH_GUEST_DESCRIPTION,
  AUTH_SEND_LINK,
  AUTH_SENDING,
} from './lib'

export function AuthGuestForm({
  email,
  isLoading,
  message,
  onEmailChange,
  onSubmit,
}: AuthGuestFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {AUTH_GUEST}
          <Badge variant="secondary">{AUTH_GUEST_BADGE}</Badge>
        </CardTitle>
        <CardDescription>{AUTH_GUEST_DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {message && (
            <div
              className={`rounded-md p-3 text-sm ${
                message.type === 'error'
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-green-500/10 text-green-600'
              }`}
            >
              {message.text}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              {AUTH_EMAIL_LABEL}
            </label>
            <Input
              id="email"
              type="email"
              placeholder={AUTH_EMAIL_PLACEHOLDER}
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? AUTH_SENDING : AUTH_SEND_LINK}
          </Button>
          <p className="text-xs text-muted-foreground text-center">{AUTH_DEV_HINT}</p>
        </form>
      </CardContent>
    </Card>
  )
}
