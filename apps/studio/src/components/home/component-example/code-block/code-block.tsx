import type { CodeBlockProps } from '../lib'

export function CodeBlock({ code, language = 'typescript' }: CodeBlockProps) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
      <code className={`language-${language}`}>{code.trim()}</code>
    </pre>
  )
}
