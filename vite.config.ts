import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  resolve: {
    alias: {
      'frappe-gantt/dist/frappe-gantt.css': path.resolve(
        __dirname,
        'node_modules/frappe-gantt/dist/frappe-gantt.css',
      ),
    },
  },
})
