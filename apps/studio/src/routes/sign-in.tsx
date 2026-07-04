import { createFileRoute } from '@tanstack/react-router'
import { AuthSection } from '@/components/home/component-example/auth-section'

function SignIn() {
  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-md flex-col justify-center gap-6 p-6">
      <div className="space-y-1 text-center">
        <h1 className="text-3xl font-bold">Sign in</h1>
        <p className="text-muted-foreground">Enter your email and we'll send you a magic link.</p>
      </div>
      <AuthSection />
    </div>
  )
}

export const Route = createFileRoute('/sign-in')({ component: SignIn })
