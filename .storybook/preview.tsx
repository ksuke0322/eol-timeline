import React from 'react'
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
      test: 'error',
    },
  },
  loaders: [mswLoader],
  decorators: [
    (Story) => (
      // <main>
      <Story />
      // </main>
    ),
  ],
}

export default preview
