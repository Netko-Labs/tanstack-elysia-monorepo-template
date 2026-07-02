import { Badge } from '@temp-repo/ui/components/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@temp-repo/ui/components/card'
import type { SubscriptionStatusProps } from '../lib'
import { SUBSCRIPTION_BADGE, SUBSCRIPTION_DESCRIPTION, SUBSCRIPTION_TITLE } from '../lib'

export function SubscriptionStatus({ lastUpdate }: SubscriptionStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{SUBSCRIPTION_TITLE}</CardTitle>
        <CardDescription>{SUBSCRIPTION_DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Badge variant="outline">{SUBSCRIPTION_BADGE}</Badge>
        {lastUpdate && (
          <Badge variant="secondary" className="ml-auto">
            Last update: {lastUpdate}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
