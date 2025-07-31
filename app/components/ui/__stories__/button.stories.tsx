import { within, expect } from '@storybook/test'

import type { Meta, StoryObj, StoryContext } from '@storybook/react'

import { Button } from '~/components/ui/button'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas.
    // https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component has an inferred title, so we can remove the explicit title field here.
  // https://storybook.js.org/docs/api/argtypes
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    children: 'Button',
  },
  render: (args: Parameters<typeof Button>[0]) => <Button {...args} />,
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
  render: (args: Parameters<typeof Button>[0]) => <Button {...args} />,
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive Button',
  },
  render: (args: Parameters<typeof Button>[0]) => <Button {...args} />,
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
  render: (args: Parameters<typeof Button>[0]) => <Button {...args} />,
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
  render: (args: Parameters<typeof Button>[0]) => <Button {...args} />,
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
  render: (args: Parameters<typeof Button>[0]) => <Button {...args} />,
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
  render: (args: Parameters<typeof Button>[0]) => <Button {...args} />,
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
  render: (args: Parameters<typeof Button>[0]) => <Button {...args} />,
}

export const Icon: Story = {
  args: {
    size: 'icon',
    children: '⚙️', // Example icon
  },
  render: (args: Parameters<typeof Button>[0]) => <Button {...args} />,
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
  render: (args: Parameters<typeof Button>[0]) => <Button {...args} />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Disabled Button' })
    await expect(button).toBeDisabled()
  },
}

export const WithLongText: Story = {
  args: {
    children:
      'This is a very long button text to check how the component handles text wrapping and overflow',
  },
  render: (args: Parameters<typeof Button>[0]) => (
    <div style={{ width: '200px' }}>
      <Button {...args} />
    </div>
  ),
  decorators: [
    (Story, context: StoryContext) => (
      <div style={{ width: '200px' }}>{Story(context.args)}</div>
    ),
  ],
}
