import { within, expect, userEvent, waitFor } from '@storybook/test'
import * as React from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Checkbox } from '~/components/ui/checkbox'

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args: Parameters<typeof Checkbox>[0]) => (
    <Checkbox aria-label="Default checkbox" {...args} />
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox')
    await userEvent.click(checkbox)
    await waitFor(() => expect(checkbox).toBeChecked())
    await userEvent.click(checkbox)
    await waitFor(() => expect(checkbox).not.toBeChecked())
  },
}

export const Checked: Story = {
  args: {
    checked: true,
  },
  render: (args: Parameters<typeof Checkbox>[0]) => {
    const [checked, setChecked] = React.useState(args.checked)
    return (
      <Checkbox
        aria-label="Checked checkbox"
        {...args}
        checked={checked}
        onCheckedChange={() => setChecked(!checked)}
      />
    )
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const checkbox = await canvas.findByRole('checkbox')
    await expect(checkbox).toBeChecked()
    await userEvent.click(checkbox)
    await waitFor(() => expect(checkbox).not.toBeChecked())
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args: Parameters<typeof Checkbox>[0]) => (
    <Checkbox aria-label="Disabled checkbox" {...args} />
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox')
    await expect(checkbox).toBeDisabled()
    await userEvent.click(checkbox)
    await expect(checkbox).toBeDisabled()
  },
}

export const WithLabel: Story = {
  render: (args: Parameters<typeof Checkbox>[0]) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" {...args} />
      <label
        htmlFor="terms"
        className={`
          text-sm leading-none font-medium
          peer-disabled:cursor-not-allowed peer-disabled:opacity-70
        `}
      >
        Accept terms and conditions
      </label>
    </div>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', {
      name: 'Accept terms and conditions',
    })
    await userEvent.click(checkbox)
    await waitFor(() => expect(checkbox).toBeChecked())
  },
}

export const WithLongLabel: Story = {
  render: (args: Parameters<typeof Checkbox>[0]) => (
    <div className="flex w-64 items-start space-x-2">
      <Checkbox id="long-label" {...args} />
      <label
        htmlFor="long-label"
        className={`
          text-sm leading-none font-medium
          peer-disabled:cursor-not-allowed peer-disabled:opacity-70
        `}
      >
        This is an extremely long label for a checkbox to verify that the text
        wraps correctly and the layout remains aligned.
      </label>
    </div>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', {
      name: /This is an extremely long label/i,
    })
    await userEvent.click(checkbox)
    await waitFor(() => expect(checkbox).toBeChecked())
  },
}
