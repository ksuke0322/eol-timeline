import { within, expect, userEvent, screen, waitFor } from '@storybook/test'

import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '~/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip'

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args: Parameters<typeof Tooltip>[0]) => (
    <Tooltip {...args}>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Hover' })

    await expect(
      screen.queryByRole('tooltip', { name: 'Add to library' }),
    ).not.toBeInTheDocument()

    await userEvent.hover(trigger)
    await waitFor(() => {
      expect(
        screen.queryByRole('tooltip', { name: 'Add to library' }),
      ).toBeVisible()
    })

    await userEvent.unhover(trigger)
    await waitFor(() => {
      expect(
        screen.queryByRole('tooltip', { name: 'Add to library' }),
      ).not.toBeVisible()
    })
  },
}

export const WithLongContent: Story = {
  render: (args: Parameters<typeof Tooltip>[0]) => (
    <Tooltip {...args}>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a very long tooltip content that should wrap nicely.</p>
      </TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Hover' })

    await expect(
      screen.queryByRole('tooltip', {
        name: 'This is a very long tooltip content that should wrap nicely.',
      }),
    ).not.toBeInTheDocument()

    await userEvent.hover(trigger)
    await waitFor(() => {
      expect(
        screen.queryByRole('tooltip', {
          name: 'This is a very long tooltip content that should wrap nicely.',
        }),
      ).toBeVisible()
    })

    await userEvent.unhover(trigger)
    await waitFor(() => {
      expect(
        screen.queryByRole('tooltip', {
          name: 'This is a very long tooltip content that should wrap nicely.',
        }),
      ).not.toBeVisible()
    })
  },
}

export const WithSide: Story = {
  render: (args: Parameters<typeof Tooltip>[0]) => (
    <div className="flex gap-4">
      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <Button variant="outline">Top</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Tooltip on top</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <Button variant="outline">Right</Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Tooltip on right</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip on bottom</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <Button variant="outline">Left</Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Tooltip on left</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)

    await expect(
      screen.queryByRole('tooltip', { name: 'Tooltip on top' }),
    ).not.toBeInTheDocument()
    await expect(
      screen.queryByRole('tooltip', { name: 'Tooltip on right' }),
    ).not.toBeInTheDocument()
    await expect(
      screen.queryByRole('tooltip', { name: 'Tooltip on bottom' }),
    ).not.toBeInTheDocument()
    await expect(
      screen.queryByRole('tooltip', { name: 'Tooltip on left' }),
    ).not.toBeInTheDocument()

    const topTrigger = canvas.getByRole('button', { name: 'Top' })
    await userEvent.hover(topTrigger)
    await waitFor(() => {
      expect(
        screen.queryByRole('tooltip', { name: 'Tooltip on top' }),
      ).toBeVisible()
    })

    // FIX ME: unhover 系は flaky & Default で担保済みのためここでは検証しない
    // await userEvent.unhover(topTrigger)
    // await waitFor(() => {
    //   expect(
    //     screen.queryByRole('tooltip', { name: 'Tooltip on top' }),
    //   ).not.toBeVisible()
    // })

    const rightTrigger = canvas.getByRole('button', { name: 'Right' })
    await userEvent.hover(rightTrigger)
    await waitFor(() => {
      expect(
        screen.queryByRole('tooltip', { name: 'Tooltip on right' }),
      ).toBeVisible()
    })

    // await userEvent.unhover(rightTrigger)
    // await waitFor(() => {
    //   expect(
    //     screen.queryByRole('tooltip', { name: 'Tooltip on right' }),
    //   ).not.toBeVisible()
    // })

    const bottomTrigger = canvas.getByRole('button', { name: 'Bottom' })
    await userEvent.hover(bottomTrigger)
    await waitFor(() => {
      expect(
        screen.queryByRole('tooltip', { name: 'Tooltip on bottom' }),
      ).toBeVisible()
    })

    // await userEvent.unhover(bottomTrigger)
    // await waitFor(() => {
    //   expect(
    //     screen.queryByRole('tooltip', { name: 'Tooltip on bottom' }),
    //   ).not.toBeVisible()
    // })

    const leftTrigger = canvas.getByRole('button', { name: 'Left' })
    await userEvent.hover(leftTrigger)
    await waitFor(() => {
      expect(
        screen.queryByRole('tooltip', { name: 'Tooltip on left' }),
      ).toBeVisible()
    })

    // await userEvent.unhover(leftTrigger)
    // await waitFor(() => {
    //   expect(
    //     screen.queryByRole('tooltip', { name: 'Tooltip on left' }),
    //   ).not.toBeVisible()
    // })
  },
}
