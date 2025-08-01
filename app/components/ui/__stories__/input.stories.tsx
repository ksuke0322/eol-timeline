import { within, expect, userEvent } from '@storybook/test'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Input } from '~/components/ui/input'

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args: Parameters<typeof Input>[0]) => <Input {...args} />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    await userEvent.type(input, 'Hello, world!')
    await expect(input).toHaveValue('Hello, world!')
  },
}

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Email',
  },
  render: (args: Parameters<typeof Input>[0]) => <Input {...args} />,
}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled',
  },
  render: (args: Parameters<typeof Input>[0]) => <Input {...args} />,
}

export const WithLabel: Story = {
  render: (args: Parameters<typeof Input>[0]) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="email">Email</label>
      <Input type="email" id="email" placeholder="Email" {...args} />
    </div>
  ),
}

export const Invalid: Story = {
  args: {
    'aria-invalid': true,
    placeholder: 'Invalid Input',
  },
  render: (args: Parameters<typeof Input>[0]) => <Input {...args} />,
}

export const WithLongInputAndSpecialChars: Story = {
  args: {
    defaultValue: `あいうえお😀日本語と絵文字とEnglishとspecial chars &<>"\``,
  },
  render: (args: Parameters<typeof Input>[0]) => <Input {...args} />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    await expect(input).toHaveValue(
      `あいうえお😀日本語と絵文字とEnglishとspecial chars &<>"\``,
    )
  },
}
