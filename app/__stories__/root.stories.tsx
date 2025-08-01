import type { Meta, StoryObj } from '@storybook/react-vite'

import { ErrorBoundary } from '~/root'

const _errorBoundaryMeta = {
  title: 'App/Root/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ErrorBoundary>
export default _errorBoundaryMeta

type ErrorBoundaryStory = StoryObj<typeof _errorBoundaryMeta> & {
  args: { params: Record<string, string | undefined> }
}

export const ErrorBoundaryStory: ErrorBoundaryStory = {
  args: {
    error: new Error('Something went wrong!'),
    params: {} as Record<string, string | undefined>,
  },
  render: (args: Parameters<typeof ErrorBoundary>[0]) => (
    <ErrorBoundary {...args} />
  ),
}

export const NotFoundError: ErrorBoundaryStory = {
  args: {
    error: {
      status: 404,
      statusText: 'Not Found',
      data: 'Page not found',
    },
    params: {},
  },
  render: (args: Parameters<typeof ErrorBoundary>[0]) => (
    <ErrorBoundary {...args} />
  ),
}
