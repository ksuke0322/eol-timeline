import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

import { SearchInputWithDebounce } from '../searchInputWithDebounce'

describe('SearchInputWithDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('入力後、指定されたデバウンス時間後にonDebouncedChangeが呼び出されること', () => {
    const onDebouncedChange = vi.fn()
    render(
      <SearchInputWithDebounce
        onDebouncedChange={onDebouncedChange}
        initialValue=""
      />,
    )
    const input = screen.getByPlaceholderText('Search products...')

    fireEvent.change(input, { target: { value: 'test' } })
    expect(onDebouncedChange).not.toHaveBeenCalled()

    vi.advanceTimersByTime(299)
    expect(onDebouncedChange).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(onDebouncedChange).toHaveBeenCalledTimes(1)
    expect(onDebouncedChange).toHaveBeenCalledWith('test')

    fireEvent.change(input, { target: { value: 'another test' } })
    vi.advanceTimersByTime(300)
    expect(onDebouncedChange).toHaveBeenCalledTimes(2)
    expect(onDebouncedChange).toHaveBeenCalledWith('another test')
  })

  it('クリアボタンがクリックされたときにonDebouncedChangeが空文字列で呼び出されること', () => {
    const onDebouncedChange = vi.fn()
    render(
      <SearchInputWithDebounce
        onDebouncedChange={onDebouncedChange}
        initialValue="initial"
      />,
    )
    const input = screen.getByPlaceholderText('Search products...')
    const clearButton = screen.getByLabelText('Clear search')

    expect(input).toHaveValue('initial')
    expect(clearButton).toBeVisible()

    fireEvent.click(clearButton)

    expect(input).toHaveValue('')
    vi.advanceTimersByTime(300)
    expect(onDebouncedChange).toHaveBeenCalledWith('')
    expect(clearButton).not.toBeVisible()
  })

  it('初期値が正しく設定されること', () => {
    const onDebouncedChange = vi.fn()
    render(
      <SearchInputWithDebounce
        onDebouncedChange={onDebouncedChange}
        initialValue="initial value"
      />,
    )

    vi.advanceTimersByTime(300)
    expect(onDebouncedChange).toHaveBeenCalledWith('initial value')
  })

  it('debounceTimeが変更されたときに正しく動作すること', () => {
    const onDebouncedChange = vi.fn()
    const { rerender } = render(
      <SearchInputWithDebounce
        onDebouncedChange={onDebouncedChange}
        debounceTime={500}
      />,
    )
    const input = screen.getByPlaceholderText('Search products...')

    fireEvent.change(input, { target: { value: 'test' } })
    vi.advanceTimersByTime(499)
    expect(onDebouncedChange).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(onDebouncedChange).toHaveBeenCalledWith('test')

    onDebouncedChange.mockClear()
    rerender(
      <SearchInputWithDebounce
        onDebouncedChange={onDebouncedChange}
        debounceTime={1000}
      />,
    )
    fireEvent.change(input, { target: { value: 'new test' } })
    vi.advanceTimersByTime(999)
    expect(onDebouncedChange).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(onDebouncedChange).toHaveBeenCalledWith('new test')
  })
})
