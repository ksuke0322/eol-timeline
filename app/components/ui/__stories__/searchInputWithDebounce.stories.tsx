import { useState } from 'react'
import { within, expect, userEvent, fn } from 'storybook/test'

import type { Meta, StoryObj } from '@storybook/react-vite'

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
    onDebouncedChange: fn(),
  },
  render: (args: Parameters<typeof SearchInputWithDebounce>[0]) => {
    const [debouncedValue, setDebouncedValue] = useState('')

    return (
      <div className="w-[300px]">
        <SearchInputWithDebounce
          {...args}
          onDebouncedChange={(value) => {
            setDebouncedValue(value)
            args.onDebouncedChange?.(value) // <-- call the spy so play() can observe it
          }}
        />
        <p className="mt-4">Debounced Value: {debouncedValue}</p>
      </div>
    )
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Search products...')

    await userEvent.type(input, 'test', { delay: null })

    await new Promise((r) => setTimeout(r, 290))
    expect(args.onDebouncedChange).not.toHaveBeenCalled()

    await new Promise((r) => setTimeout(r, 310))
    expect(args.onDebouncedChange).toHaveBeenCalledWith('test')
  },
}

export const WithInitialValue: Story = {
  args: {
    initialValue: 'Hello',
    onDebouncedChange: fn(),
  },
  render: (args: Parameters<typeof SearchInputWithDebounce>[0]) => {
    const [debouncedValue, setDebouncedValue] = useState(
      args.initialValue || '',
    )

    return (
      <div className="w-[300px]">
        <SearchInputWithDebounce
          {...args}
          onDebouncedChange={(value) => {
            setDebouncedValue(value)
            args.onDebouncedChange?.(value)
          }}
        />
        <p className="mt-4">Debounced Value: {debouncedValue}</p>
      </div>
    )
  },
}

export const CustomDebounceTime: Story = {
  args: {
    debounceTime: 1000,
    onDebouncedChange: fn(),
  },
  render: (args: Parameters<typeof SearchInputWithDebounce>[0]) => {
    const [debouncedValue, setDebouncedValue] = useState('')

    return (
      <div className="w-[300px]">
        <SearchInputWithDebounce
          {...args}
          onDebouncedChange={(value) => {
            setDebouncedValue(value)
            args.onDebouncedChange?.(value) // <-- call the spy so play() can observe it
          }}
        />
        <p className="mt-4">Debounced Value (1s delay): {debouncedValue}</p>
      </div>
    )
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Search products...')

    await userEvent.type(input, 'test', { delay: null })

    await new Promise((r) => setTimeout(r, 900))
    expect(args.onDebouncedChange).not.toHaveBeenCalled()

    await new Promise((r) => setTimeout(r, 1100))
    expect(args.onDebouncedChange).toHaveBeenCalledWith('test')
  },
}

export const WithClearButton: Story = {
  args: {
    initialValue: 'search query',
    onDebouncedChange: fn(),
  },
  render: (args: Parameters<typeof SearchInputWithDebounce>[0]) => {
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
          onDebouncedChange={(value) => {
            setDebouncedValue(value)
            args.onDebouncedChange?.(value)
          }}
        />
        <p className="mt-4">Debounced Value: {debouncedValue}</p>
      </div>
    )
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Search products...')
    const clearButton = canvas.getByLabelText('Clear search')

    // 初期値が設定されていることを確認
    expect(input).toHaveValue('search query')
    expect(clearButton).toBeVisible()

    // クリアボタンをクリック
    await userEvent.click(clearButton)

    // 入力値がクリアされ、onDebouncedChangeが空文字列で呼び出されることを確認
    expect(input).toHaveValue('')
    expect(args.onDebouncedChange).toHaveBeenCalledWith('')
    expect(clearButton).not.toBeVisible()
  },
}

export const WithLongInputAndSpecialChars: Story = {
  args: {
    initialValue: "あいうえお😀日本語と絵文字とEnglishとspecial chars &<>''\"`",
    onDebouncedChange: fn(),
  },
  render: (args: Parameters<typeof SearchInputWithDebounce>[0]) => {
    const [debouncedValue, setDebouncedValue] = useState(
      args.initialValue || '',
    )

    return (
      <div className="w-[300px]">
        <SearchInputWithDebounce
          {...args}
          onDebouncedChange={(value) => {
            setDebouncedValue(value)
            args.onDebouncedChange?.(value)
          }}
        />
        <p className="mt-4">Debounced Value: {debouncedValue}</p>
      </div>
    )
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    const longText =
      "あいうえお😀日本語と絵文字とEnglishとspecial chars &<>''\"`"

    await new Promise((r) => setTimeout(r, 310))
    await expect(input).toHaveValue(longText)
    await expect(args.onDebouncedChange).toHaveBeenCalledWith(longText)
  },
}
