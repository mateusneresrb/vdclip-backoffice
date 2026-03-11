import antfu from '@antfu/eslint-config'
import prettier from 'eslint-config-prettier'

export default antfu(
  {
    react: true,
    typescript: true,
    ignores: [
      'src/components/ui/**',
      'src/routeTree.gen.ts',
      'dist/**',
      '.claude/**',
      'eslint.config.mjs',
      'public/**',
      '**/*.md',
      '**/*.md/**',
    ],
  },
  {
    rules: {
      'react/no-implicit-key': 'off',
    },
  },
  prettier,
)
