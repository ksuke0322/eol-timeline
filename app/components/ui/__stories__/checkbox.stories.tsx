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
  render: (args) => <Checkbox {...args} />,
}

export const Checked: Story = {
  args: {
    checked: true,
  },
  render: (args) => <Checkbox {...args} />,
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => <Checkbox {...args} />,
}

export const WithLabel: Story = {
  render: (args) => (
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
}
