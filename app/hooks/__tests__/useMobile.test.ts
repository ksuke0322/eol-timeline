import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'

import { useIsMobile } from '~/hooks/useMobile'

// MediaQueryListのモック
const createMatchMediaMock = (matches: boolean) => {
  let listeners: ((event: Partial<MediaQueryListEvent>) => void)[] = []

  const mock = vi.fn().mockImplementation(() => ({
    matches,
    media: `(max-width: 767px)`,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: (
      event: string,
      listener: (event: Partial<MediaQueryListEvent>) => void,
    ) => {
      if (event === 'change') {
        listeners.push(listener)
      }
    },
    removeEventListener: (
      event: string,
      listener: (event: Partial<MediaQueryListEvent>) => void,
    ) => {
      if (event === 'change') {
        listeners = listeners.filter((l) => l !== listener)
      }
    },
    dispatchEvent: (event: Event) => {
      listeners.forEach((listener) => listener(event as MediaQueryListEvent))
      return true
    },
    // テスト内で状態を変化させるためのヘルパー
    _triggerChange: (newMatches: boolean) => {
      matches = newMatches
      listeners.forEach((listener) => listener({ matches }))
    },
  }))

  return mock
}

describe('useIsMobile', () => {
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    // 各テストの前にモックをセットアップ
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
    vi.restoreAllMocks()
  })

  it('初期状態でモバイル表示の場合 true を返すこと', () => {
    window.matchMedia = createMatchMediaMock(true)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('初期状態でデスクトップ表示の場合 false を返すこと', () => {
    window.matchMedia = createMatchMediaMock(false)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('画面サイズの変更に応じて値が更新されること', () => {
    const matchMediaMock = createMatchMediaMock(false)
    window.matchMedia = matchMediaMock

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    // モバイルサイズに変更
    act(() => {
      matchMediaMock()._triggerChange(true)
    })
    expect(result.current).toBe(true)

    // デスクトップサイズに再度変更
    act(() => {
      matchMediaMock()._triggerChange(false)
    })
    expect(result.current).toBe(false)
  })
})
