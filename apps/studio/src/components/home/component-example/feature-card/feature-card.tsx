import { Link } from '@tanstack/react-router'
import { Badge } from '@temp-repo/ui/components/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@temp-repo/ui/components/card'
import type { FeatureCardProps } from '../lib'

export function FeatureCard({ title, description, href, badge }: FeatureCardProps) {
  return (
    <Link to={href}>
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {title}
            {badge && <Badge variant="outline">{badge}</Badge>}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
