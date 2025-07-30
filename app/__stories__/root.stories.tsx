import type { Meta, StoryObj } from '@storybook/react'

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

type ErrorBoundaryStory = StoryObj<typeof _errorBoundaryMeta>

export const ErrorBoundaryStory: ErrorBoundaryStory = {
  args: {
    error: new Error('Something went wrong!'),
    params: {},
    loaderData: undefined,
    actionData: undefined,
  },
  render: (args: any) => <ErrorBoundary {...args} />,
}

export const NotFoundError: ErrorBoundaryStory = {
  args: {
    error: {
      status: 404,
      statusText: 'Not Found',
      data: 'Page not found',
    },
    params: {},
    loaderData: undefined,
    actionData: undefined,
  },
  render: (args: any) => <ErrorBoundary {...args} />,
}
