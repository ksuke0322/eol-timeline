import { renderHook, waitFor } from '@testing-library/react'

import { useProducts } from '../use-products'

import { type ProductDetails } from '~/lib/types'

describe('useProducts', () => {
  const mockProductDetails: ProductDetails = {
    product1: [{ cycle: '1.0', releaseDate: '2023-01-01', eol: '2024-01-01' }],
    product2: [{ cycle: '2.0', releaseDate: '2023-02-01', eol: '2024-02-01' }],
  }

  const mockFetchSuccess = () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ['product1', 'product2'],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProductDetails.product1,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProductDetails.product2,
      })
  }

  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('製品リストと詳細が正常に取得できること', async () => {
    mockFetchSuccess()

    const { result } = renderHook(() => useProducts())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.products).toEqual(mockProductDetails)
    expect(result.current.error).toBeNull()
    expect(fetch).toHaveBeenCalledTimes(3) // all.json + 2 product details
  })

  it('製品リストの取得に失敗した場合、エラーが設定されること', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
    })

    const { result } = renderHook(() => useProducts())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.products).toEqual({})
    expect(result.current.error).not.toBeNull()
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('個別の製品詳細の取得に失敗した場合、その製品はスキップされること', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ['product1', 'product2'],
      })
      .mockResolvedValueOnce({
        ok: false,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProductDetails.product2,
      })

    const { result } = renderHook(() => useProducts())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.products).toEqual({
      product2: mockProductDetails.product2,
    })
    expect(result.current.error).toBeNull()
    expect(fetch).toHaveBeenCalledTimes(3)
  })

  it('キャッシュが存在し、有効期限内の場合はキャッシュを使用すること', async () => {
    const cachedTimestamp = Date.now()
    localStorage.setItem(
      'eol_products_cache',
      JSON.stringify({
        data: mockProductDetails,
        timestamp: cachedTimestamp,
      }),
    )

    const { result } = renderHook(() => useProducts())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.products).toEqual(mockProductDetails)
    expect(fetch).not.toHaveBeenCalled() // fetchが呼ばれないことを確認
  })

  it('キャッシュが存在するが、有効期限切れの場合はAPIから再取得すること', async () => {
    const expiredTimestamp = Date.now() - 24 * 60 * 60 * 1000 - 1 // 1日と1ミリ秒前
    localStorage.setItem(
      'eol_products_cache',
      JSON.stringify({
        data: { oldProduct: [] }, // 古いデータ
        timestamp: expiredTimestamp,
      }),
    )

    mockFetchSuccess() // APIからの新しいデータ取得をモック

    const { result } = renderHook(() => useProducts())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.products).toEqual(mockProductDetails)
    expect(fetch).toHaveBeenCalledTimes(3) // APIから再取得されることを確認
  })

  it('キャッシュが存在しない場合はAPIから取得し、キャッシュに保存すること', async () => {
    mockFetchSuccess()

    const { result } = renderHook(() => useProducts())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.products).toEqual(mockProductDetails)
    expect(fetch).toHaveBeenCalledTimes(3)
    expect(localStorage.getItem('eol_products_cache')).not.toBeNull()
    const cachedData = JSON.parse(
      localStorage.getItem('eol_products_cache') || '{}',
    )
    expect(cachedData.data).toEqual(mockProductDetails)
    expect(Date.now() - cachedData.timestamp).toBeLessThan(100) // ほぼ現在のタイムスタンプ
  })
})
