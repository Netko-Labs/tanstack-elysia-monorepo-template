import { Separator } from '@temp-repo/ui/components/separator'
import { AuthSection } from './auth-section/auth-section'
import { CodeExamples } from './code-examples/code-examples'
import { FeatureCard } from './feature-card/feature-card'
import {
  AUTH_SECTION_TITLE,
  CODE_EXAMPLES_SECTION_TITLE,
  FEATURE_CARDS,
  FOOTER_TEXT,
  INTERACTIVE_SECTION_TITLE,
  PAGE_DESCRIPTION,
  PAGE_TITLE,
  TECH_STACK_SECTION_TITLE,
  UI_SECTION_TITLE,
} from './lib'
import { TechStack } from './tech-stack/tech-stack'
import { UiShowcase } from './ui-showcase/ui-showcase'

export function ComponentExample() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">{PAGE_TITLE}</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{PAGE_DESCRIPTION}</p>
        </div>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">{AUTH_SECTION_TITLE}</h2>
          <AuthSection />
        </section>

        <Separator className="my-8" />

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">{INTERACTIVE_SECTION_TITLE}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {FEATURE_CARDS.map((card) => (
              <FeatureCard key={card.href} {...card} />
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">{TECH_STACK_SECTION_TITLE}</h2>
          <TechStack />
        </section>

        <Separator className="my-8" />

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">{CODE_EXAMPLES_SECTION_TITLE}</h2>
          <CodeExamples />
        </section>

        <Separator className="my-8" />

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">{UI_SECTION_TITLE}</h2>
          <UiShowcase />
        </section>

        <footer className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>{FOOTER_TEXT}</p>
        </footer>
      </div>
    </div>
  )
}
