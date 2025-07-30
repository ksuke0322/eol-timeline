import type { Meta, StoryObj } from '@storybook/react'

import { Separator } from '~/components/ui/separator'

const meta = {
  title: 'UI/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: (args: Parameters<typeof Separator>[0]) => (
    <div className="w-[200px]">
      <div className="space-y-1">
        <h4 className="text-sm leading-none font-medium">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator {...args} className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator {...args} orientation="vertical" />
        <div>Docs</div>
        <Separator {...args} orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
}

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args: Parameters<typeof Separator>[0]) => (
    <div className="flex h-[100px] items-center justify-center">
      <div>Blog</div>
      <Separator {...args} className="mx-4" />
      <div>Docs</div>
      <Separator {...args} className="mx-4" />
      <div>Source</div>
    </div>
  ),
}
