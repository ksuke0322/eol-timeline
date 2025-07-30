import { within, expect, userEvent, screen } from '@storybook/test'

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

    await expect(screen.queryByText('Add to library')).not.toBeInTheDocument()

    await userEvent.hover(trigger, { delay: 200 })
    await expect(screen.queryAllByText('Add to library')[0]).toBeVisible()

    await userEvent.unhover(trigger, { delay: 200 })
    await expect(screen.queryByText('Add to library')).not.toBeInTheDocument()
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
      screen.queryByText(
        'This is a very long tooltip content that should wrap nicely.',
      ),
    ).not.toBeInTheDocument()

    await userEvent.hover(trigger, { delay: 200 })
    await expect(
      screen.queryAllByText(
        'This is a very long tooltip content that should wrap nicely.',
      )[0],
    ).toBeVisible()

    await userEvent.unhover(trigger, { delay: 200 })
    await expect(
      screen.queryByText(
        'This is a very long tooltip content that should wrap nicely.',
      ),
    ).not.toBeInTheDocument()
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

    await expect(screen.queryByText('Tooltip on top')).not.toBeInTheDocument()
    await expect(screen.queryByText('Tooltip on right')).not.toBeInTheDocument()
    await expect(
      screen.queryByText('Tooltip on bottom'),
    ).not.toBeInTheDocument()
    await expect(screen.queryByText('Tooltip on left')).not.toBeInTheDocument()

    const topTrigger = canvas.getByRole('button', { name: 'Top' })
    await userEvent.hover(topTrigger, { delay: 200 })
    await expect(screen.queryAllByText('Tooltip on top')[0]).toBeVisible()

    await userEvent.unhover(topTrigger, { delay: 200 })
    await expect(screen.queryByText('Tooltip on top')).not.toBeInTheDocument()

    const rightTrigger = canvas.getByRole('button', { name: 'Right' })
    await userEvent.hover(rightTrigger, { delay: 200 })
    await expect(screen.queryAllByText('Tooltip on right')[0]).toBeVisible()

    await userEvent.unhover(rightTrigger, { delay: 200 })
    await expect(screen.queryByText('Tooltip on right')).not.toBeInTheDocument()

    const bottomTrigger = canvas.getByRole('button', { name: 'Bottom' })
    await userEvent.hover(bottomTrigger, { delay: 200 })
    await expect(screen.queryAllByText('Tooltip on bottom')[0]).toBeVisible()

    await userEvent.unhover(bottomTrigger, { delay: 200 })
    await expect(
      screen.queryByText('Tooltip on bottom'),
    ).not.toBeInTheDocument()

    const leftTrigger = canvas.getByRole('button', { name: 'Left' })
    await userEvent.hover(leftTrigger, { delay: 200 })
    await expect(screen.queryAllByText('Tooltip on left')[0]).toBeVisible()

    await userEvent.unhover(leftTrigger, { delay: 200 })
    await expect(screen.queryByText('Tooltip on left')).not.toBeInTheDocument()
  },
}
