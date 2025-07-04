import { renderHook, waitFor } from '@testing-library/react'

import { useProducts } from '../use-products'

describe('useProducts', () => {
  it('製品リストと詳細が正常に取得できること', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        // Mock for all.json
        ok: true,
        json: async () => ['product1', 'product2'],
      })
      .mockResolvedValueOnce({
        // Mock for product1.json
        ok: true,
        json: async () => [
          {
            cycle: '1.0',
            releaseDate: '2023-01-01',
            eol: '2024-01-01',
          },
        ],
      })
      .mockResolvedValueOnce({
        // Mock for product2.json
        ok: true,
        json: async () => [
          {
            cycle: '2.0',
            releaseDate: '2023-02-01',
            eol: '2024-02-01',
          },
        ],
      })

    const { result } = renderHook(() => useProducts())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.products).toEqual({
      product1: [
        {
          cycle: '1.0',
          releaseDate: '2023-01-01',
          eol: '2024-01-01',
        },
      ],
      product2: [
        {
          cycle: '2.0',
          releaseDate: '2023-02-01',
          eol: '2024-02-01',
        },
      ],
    })
    expect(result.current.error).toBeNull()
  })

  it('製品リストの取得に失敗した場合、エラーが設定されること', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
    })

    const { result } = renderHook(() => useProducts())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.products).toEqual({})
    expect(result.current.error).not.toBeNull()
  })

  it('個別の製品詳細の取得に失敗した場合、その製品はスキップされること', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        // Mock for all.json
        ok: true,
        json: async () => ['product1', 'product2'],
      })
      .mockResolvedValueOnce({
        // Mock for product1.json (fails)
        ok: false,
      })
      .mockResolvedValueOnce({
        // Mock for product2.json
        ok: true,
        json: async () => [
          {
            cycle: '2.0',
            releaseDate: '2023-02-01',
            eol: '2024-02-01',
          },
        ],
      })

    const { result } = renderHook(() => useProducts())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.products).toEqual({
      product2: [
        {
          cycle: '2.0',
          releaseDate: '2023-02-01',
          eol: '2024-02-01',
        },
      ],
    })
    expect(result.current.error).toBeNull()
  })
})
