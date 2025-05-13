import type { ESLintConfig } from '@stacksjs/eslint-config'
import stacks from '@stacksjs/eslint-config'

const config: ESLintConfig = stacks({
  stylistic: {
    indent: 2,
    quotes: 'single',
  },

  typescript: true,
  jsonc: true,
  yaml: true,
  ignores: [
    'fixtures/**',
  ],
  rules: {
    'regexp/no-invalid-regexp': 'off',
    'regexp/no-unused-capturing-group': 'off',
    'regexp/no-useless-escape': 'off',
    'regexp/prefer-regexp-exec': 'off',
    'regexp/prefer-regexp-test': 'off',
    'regexp/require-unicode-regexp': 'off',
    'regexp/strict': 'off',
    'regexp/no-obscure-range': 'off',
    'regexp/no-useless-quantifier': 'off',
    'regexp/no-useless-range': 'off',
    'regexp/no-useless-non-capturing-group': 'off',
    'eslint-plugin/no-useless-character-class': 'off',
    'regexp/no-useless-character-class': 'off',
    'regexp/prefer-question-quantifier': 'off',
    'regexp/prefer-d': 'off',
    'no-misleading-character-class': 'off',
    'regexp/no-misleading-unicode-character': 'off',
    'regexp/no-misleading-capturing-group': 'off',
    'regexp/no-useless-assertions': 'off',
    'regexp/prefer-character-class': 'off',
    'regexp/no-dupe-disjunctions': 'off',
    'regexp/no-contradiction-with-assertion': 'off',
  },
})

export default config
