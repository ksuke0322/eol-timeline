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

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: ['.husky/**/*'],
  },
  ...fixupConfigRules(
    compat.extends('eslint:recommended', 'plugin:prettier/recommended'),
  ),
  ...fixupConfigRules(
    compat.extends(
      'plugin:react-hooks/recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended',
    ),
  ).map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    ignores: [
      'eslint.config.mjs',
      'postcss.config.cjs',
      'react-router.config.ts',
      'tailwind.config.ts',
      'vite.config.ts',
      'build/**/*',
      '.react-router/**/*',
    ],

    plugins: {
      'unused-imports': unusedImports,
      'react-refresh': reactRefresh,
      react: fixupPluginRules(react),
      'jsx-a11y': fixupPluginRules(jsxA11Y),
    },

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
    compat.extends(
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
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      import: fixupPluginRules(_import),
      'unused-imports': unusedImports,
    },

    languageOptions: {
      parser: tsParser,
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
]
