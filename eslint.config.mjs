// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import unusedImports from 'eslint-plugin-unused-imports'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import jsxA11Y from 'eslint-plugin-jsx-a11y'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import _import from 'eslint-plugin-import'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: [
      'eslint.config.mjs',
      'react-router.config.ts',
      'vite.config.ts',
      '.lintstagedrc.cjs',
      'build/**/*',
      '.react-router/**/*',
      '.husky/**/*',
      '.lintstagedrc.cjs',
      '.storybook/**/*',
      'storybook-static/**/*',
      'playwright-report/**/*',
      'test-results/**/*',
      'playwright.config.ts',
    ],
  },
  {
    files: ['**/*.{ts,tsx}', '.storybook/**/*'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
  },
  ...fixupConfigRules(
    compat.extends('eslint:recommended', 'plugin:prettier/recommended'),
  ),
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:prettier/recommended',
      'plugin:react-hooks/recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
    ),
  ).map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    files: ['**/*.{ts,tsx}'],

    plugins: {
      'unused-imports': unusedImports,
      'react-refresh': reactRefresh,
      react: fixupPluginRules(react),
      'jsx-a11y': fixupPluginRules(jsxA11Y),
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      import: fixupPluginRules(_import),
      'better-tailwindcss': eslintPluginBetterTailwindcss,
    },

    settings: {
      'better-tailwindcss': {
        entryPoint: 'app/app.css',
      },

      'import/internal-regex': '^~/',

      'import/resolver': {
        node: {
          extensions: ['.ts', '.tsx', '.svg'],
        },

        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },

      react: {
        version: 'detect',
      },

      formComponents: ['Form'],

      linkComponents: [
        {
          name: 'Link',
          linkAttribute: 'to',
        },
        {
          name: 'NavLink',
          linkAttribute: 'to',
        },
      ],
    },

    rules: {
      // enable all recommended rules to report a warning
      ...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
      // enable all recommended rules to report an error
      ...eslintPluginBetterTailwindcss.configs['recommended-error'].rules,

      'unused-imports/no-unused-imports': 'warn',

      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],

          alphabetize: {
            order: 'asc',
          },

          'newlines-between': 'always',
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],

      'react/prop-types': 0,

      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      'better-tailwindcss/no-unregistered-classes': 'off',
    },
  },
  ...storybook.configs['flat/recommended'],
]
