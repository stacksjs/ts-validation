import type { BunpressConfig } from 'bunpress'

const config: BunpressConfig = {
  name: 'ts-validation',
  description: 'A comprehensive string validation library for TypeScript',
  url: 'https://ts-validation.stacksjs.org',
  theme: 'docs',

  nav: [
    { text: 'Guide', link: '/guide/getting-started' },
    { text: 'Rules', link: '/guide/rules' },
    { text: 'GitHub', link: 'https://github.com/stacksjs/ts-validation' },
  ],

  sidebar: [
    {
      text: 'Introduction',
      items: [
        { text: 'Overview', link: '/' },
        { text: 'Getting Started', link: '/guide/getting-started' },
      ],
    },
    {
      text: 'Validation',
      items: [
        { text: 'Validation Rules', link: '/guide/rules' },
        { text: 'Custom Validators', link: '/guide/custom-validators' },
        { text: 'Error Messages', link: '/guide/messages' },
      ],
    },
    {
      text: 'Features',
      items: [
        { text: 'Type-Safe Validation', link: '/features/type-safety' },
        { text: 'Chained Validators', link: '/features/chaining' },
        { text: 'Async Validation', link: '/features/async' },
        { text: 'Framework Integration', link: '/features/integration' },
      ],
    },
    {
      text: 'Advanced',
      items: [
        { text: 'Performance Optimization', link: '/advanced/performance' },
        { text: 'Custom Rule Extensions', link: '/advanced/extensions' },
        { text: 'Validation Schemas', link: '/advanced/schemas' },
        { text: 'Edge Cases', link: '/advanced/edge-cases' },
      ],
    },
  ],

  socialLinks: [
    { icon: 'github', link: 'https://github.com/stacksjs/ts-validation' },
  ],
}

export default config
