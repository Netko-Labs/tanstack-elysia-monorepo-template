/** @type {import('@commitlint/types').UserConfig} */
export default {
  rules: {
    // Enforce emoji + type format
    'type-enum': [
      2,
      'always',
      [
        '✨ feat', // New feature
        '🐛 fix', // Bug fix
        '📝 docs', // Documentation
        '💄 style', // Styling/formatting
        '♻️ refactor', // Code refactoring
        '⚡ perf', // Performance improvement
        '✅ test', // Tests
        '🔧 chore', // Maintenance
        '🏗️ build', // Build system
        '👷 ci', // CI/CD
        '🔒 security', // Security fix
        '🚀 release', // Release
      ],
    ],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-min-length': [2, 'always', 3],
    'header-max-length': [2, 'always', 100],
  },
  parserPreset: {
    parserOpts: {
      // Allow each emoji to carry an optional U+FE0F variation selector so types
      // like "refactor" and "build" (whose emoji include FE0F) parse, not just
      // single-codepoint emoji. FE0F is kept outside the character class to
      // satisfy lint/suspicious/noMisleadingCharacterClass.
      headerPattern:
        /^((?:[\p{Emoji_Presentation}\p{Extended_Pictographic}]️?)+\s\w+)(?:\((.+)\))?:\s(.+)$/u,
      headerCorrespondence: ['type', 'scope', 'subject'],
    },
  },
}
