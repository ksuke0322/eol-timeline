import { initialize, mswLoader } from 'msw-storybook-addon'

import type { Preview } from '@storybook/react'

import '../app/app.css'

// Initialize MSW
initialize()

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Optional: configure a11y addon
      // See https://storybook.js.org/docs/essentials/a11y#configuration
    },
  },
  loaders: [mswLoader],
}

export default preview
