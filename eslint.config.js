import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'dist',
    '**/.vscode/',
    '**/node_modules/',
    '**/.pnpm-store/',
    '**/env.d.ts',
    '**/**.yaml',
  ],
  formatters: {
    css: true,
    html: true,
  },
  rules: {
    // need this rule to be disable in order for utilizing decorators metadata
    'ts/consistent-type-imports': 'off',
    'ts/prefer-literal-enum-member': 'off',
    'antfu/no-top-level-await': 'off',
    'unused-imports/no-unused-vars': [2, {
      caughtErrors: 'none',
      argsIgnorePattern: '^_',
    }],
  },
})
