import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { removeDataTestId } from './vite-plugin-remove-data-testid'

export default defineConfig({
  plugins: [
    tailwindcss(),
    !process.env.VITEST && !process.env.STORYBOOK && reactRouter(), // reactRouterプラグインを条件付きで適用
    tsconfigPaths(),
    removeDataTestId(),
  ],
  resolve: {
    alias: {
      'frappe-gantt/dist/frappe-gantt.css': path.resolve(
        __dirname,
        'node_modules/frappe-gantt/dist/frappe-gantt.css',
      ),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
    moduleNameMapper: {
      '^~/(.*)': path.resolve(__dirname, './app/$1'),
      '\.css': 'identity-obj-proxy',
    },
    server: {
      deps: {
        inline: ['@react-router/dev/vite'],
      },
    },
    exclude: ['**/__e2e__/**'],
    include: ['app/**/*.test.{ts,tsx}'],
  },
})
