import type { Meta, StoryObj } from '@storybook/react-vite'

import { Skeleton } from '~/components/ui/skeleton'

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args: Parameters<typeof Skeleton>[0]) => (
    <Skeleton className="h-[125px] w-[250px] rounded-xl" {...args} />
  ),
}

export const Card: Story = {
  render: (args: Parameters<typeof Skeleton>[0]) => (
    <div className="flex items-center space-x-4">
      <Skeleton className="size-12 rounded-full" {...args} />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" {...args} />
        <Skeleton className="h-4 w-[200px]" {...args} />
      </div>
    </div>
  ),
}
