import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

// The Bun runtime powers the server, so `bun-sql` and other Bun built-ins must
// stay external in the Nitro server build. The explicit nitro() plugin handles
// that; the hook strips a rolldown output option Nitro doesn't yet support.
function removeUnsupportedRolldownOutputOptions(config: { output?: unknown }) {
  const outputs = Array.isArray(config.output) ? config.output : [config.output]

  for (const output of outputs) {
    if (output && typeof output === 'object' && 'codeSplitting' in output) {
      delete (output as { codeSplitting?: unknown }).codeSplitting
    }
  }
}

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    nitro({
      hooks: {
        'rollup:before': (_nitro, config) => {
          removeUnsupportedRolldownOutputOptions(config)
        },
      },
    }),
    viteReact(),
  ],
})
