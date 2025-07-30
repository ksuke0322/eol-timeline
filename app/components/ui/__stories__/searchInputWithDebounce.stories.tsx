import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { SearchInputWithDebounce } from '~/components/ui/searchInputWithDebounce'

const meta = {
  title: 'UI/SearchInputWithDebounce',
  component: SearchInputWithDebounce,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchInputWithDebounce>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onDebouncedChange: () => {},
  },
  render: function Render(args: Parameters<typeof SearchInputWithDebounce>[0]) {
    const [debouncedValue, setDebouncedValue] = useState('')

    return (
      <div className="w-[300px]">
        <SearchInputWithDebounce
          {...args}
          onDebouncedChange={setDebouncedValue}
        />
        <p className="mt-4">Debounced Value: {debouncedValue}</p>
      </div>
    )
  },
}

export const WithInitialValue: Story = {
  args: {
    initialValue: 'Hello',
    onDebouncedChange: () => {},
  },
  render: function Render(args: Parameters<typeof SearchInputWithDebounce>[0]) {
    const [debouncedValue, setDebouncedValue] = useState(
      args.initialValue || '',
    )

    return (
      <div className="w-[300px]">
        <SearchInputWithDebounce
          {...args}
          onDebouncedChange={setDebouncedValue}
        />
        <p className="mt-4">Debounced Value: {debouncedValue}</p>
      </div>
    )
  },
}

export const CustomDebounceTime: Story = {
  args: {
    debounceTime: 1000,
    onDebouncedChange: () => {},
  },
  render: function Render(args: Parameters<typeof SearchInputWithDebounce>[0]) {
    const [debouncedValue, setDebouncedValue] = useState('')

    return (
      <div className="w-[300px]">
        <SearchInputWithDebounce
          {...args}
          onDebouncedChange={setDebouncedValue}
        />
        <p className="mt-4">Debounced Value (1s delay): {debouncedValue}</p>
      </div>
    )
  },
}

export const WithClearButton: Story = {
  args: {
    initialValue: 'search query',
    onDebouncedChange: () => {},
  },
  render: function Render(args: Parameters<typeof SearchInputWithDebounce>[0]) {
    const [debouncedValue, setDebouncedValue] = useState(
      args.initialValue || '',
    )

    return (
      <div className="w-[300px]">
        <p className="mb-2 text-sm text-gray-500">
          Input has text, so the clear button (×) should be visible.
        </p>
        <SearchInputWithDebounce
          {...args}
          onDebouncedChange={setDebouncedValue}
        />
        <p className="mt-4">Debounced Value: {debouncedValue}</p>
      </div>
    )
  },
}

export const WithLongInputAndSpecialChars: Story = {
  args: {
    initialValue: "あいうえお😀日本語と絵文字とEnglishとspecial chars &<>''\"`",
    onDebouncedChange: () => {},
  },
  render: function Render(args: Parameters<typeof SearchInputWithDebounce>[0]) {
    const [debouncedValue, setDebouncedValue] = useState(
      args.initialValue || '',
    )

    return (
      <div className="w-[300px]">
        <SearchInputWithDebounce
          {...args}
          onDebouncedChange={setDebouncedValue}
        />
        <p className="mt-4">Debounced Value: {debouncedValue}</p>
      </div>
    )
  },
}
