import { act, renderHook, waitFor } from '@testing-library/react'

import { useProductDetails } from '../useProductDetails'

import type { Mock } from 'vitest'
import type { ProductDetails } from '~/lib/types'

const mockProductList: ProductDetails = {
  React: null,
  Vue: null,
  Angular: null,
}

const CACHE_KEY = 'eol_products_details_cache'

describe('useProductDetails', () => {
  // localStorage.setItem に setItemSpy をスパイする
  const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

  beforeEach(() => {
    vi.clearAllMocks()

    setItemSpy.mockClear()
    localStorage.clear()

    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025/03/28 09:00:00'))

    global.fetch = vi.fn((url: string) => {
      if (url === 'https://endoflife.date/api/React.json') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { cycle: '18', releaseDate: '2022-03-29', eol: '2025-03-29' },
              { cycle: '17', releaseDate: '2020-10-20', eol: '2023-10-20' },
            ]),
        })
      } else if (url === 'https://endoflife.date/api/Vue.json') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { cycle: '3', releaseDate: '2020-09-18', eol: '2024-03-18' },
              { cycle: '2', releaseDate: '2020-09-18', eol: '2024-03-18' },
            ]),
        })
      } else if (url === 'https://endoflife.date/api/Angular.json') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { cycle: '16', releaseDate: '2023-05-03', eol: '2024-11-03' },
            ]),
        })
      }
      return Promise.reject({
        ok: false,
      })
    }) as Mock
  })

  it('初期値としてキャッシュデータが返ること', () => {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        React: {
          data: [
            {
              cycle: 'cached.18',
              releaseDate: '1995-03-29',
              eol: '1996-03-29',
            },
            {
              cycle: 'cached.17',
              releaseDate: '2020-10-20',
              eol: '2023-10-20',
            },
          ],
          // システム時刻の23時間59分59秒前
          timestamp: new Date('2025/03/21 09:00:01').getTime(),
        },
      }),
    )

    const toggleProductMock = vi.fn()
    const setAllProductDetailsMock = vi.fn()

    renderHook(() =>
      useProductDetails({
        products: mockProductList,
        selectedProducts: [],
        toggleProduct: toggleProductMock,
        setAllProductDetails: setAllProductDetailsMock,
      }),
    )

    expect(setAllProductDetailsMock).toHaveBeenCalledWith({
      React: [
        { cycle: 'cached.18', releaseDate: '1995-03-29', eol: '1996-03-29' },
        { cycle: 'cached.17', releaseDate: '2020-10-20', eol: '2023-10-20' },
      ],
      Vue: null,
      Angular: null,
    })
  })

  it('キャッシュデータがない時、初期値として空オブジェクトが返ること', () => {
    const toggleProductMock = vi.fn()
    const setAllProductDetailsMock = vi.fn()

    renderHook(() =>
      useProductDetails({
        products: mockProductList,
        selectedProducts: [],
        toggleProduct: toggleProductMock,
        setAllProductDetails: setAllProductDetailsMock,
      }),
    )

    expect(setAllProductDetailsMock).not.toHaveBeenCalled()
  })

  it('初期値としてキャッシュデータが返ること。ただし、選択バージョンのキャッシュが有効期限切れの場合は API 通信によってデータ取得・更新が行われること。またキャッシュが想定通りの値で更新されること', () => {
    const toggleProductMock = vi.fn()
    const setAllProductDetailsMock = vi.fn()

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        // プロダクト全体が選択されている場合
        React: {
          data: [
            { cycle: 'old.18', releaseDate: '2022-03-29', eol: '2025-03-29' },
            { cycle: 'old.17', releaseDate: '2020-10-20', eol: '2023-10-20' },
          ],
          // システム時刻の1週間前
          timestamp: new Date('2025/03/21 09:00:00').getTime(),
        },
        // バージョンの一部のみ選択されている場合
        Vue: {
          data: [
            { cycle: 'old.3', releaseDate: '2020-09-18', eol: '2024-03-18' },
            { cycle: 'old.2', releaseDate: '2020-09-18', eol: '2024-03-18' },
          ],
          // システム時刻の1週間前
          timestamp: new Date('2025/03/21 09:00:00').getTime(),
        },
        // 選択されていないプロダクトの場合
        Angular: {
          data: [
            { cycle: 'old.16', releaseDate: '2023-05-03', eol: '2024-11-03' },
          ],
          // システム時刻の1週間前
          timestamp: new Date('2025/03/21 09:00:00').getTime(),
        },
      }),
    )

    renderHook(() =>
      useProductDetails({
        products: mockProductList,
        selectedProducts: ['React', 'Vue_3'],
        toggleProduct: toggleProductMock,
        setAllProductDetails: setAllProductDetailsMock,
      }),
    )

    // 同期処理を待つために待機
    waitFor(() => {
      expect(setAllProductDetailsMock).toHaveBeenCalledTimes(1)
      expect(setAllProductDetailsMock).toHaveBeenCalledWith({
        React: [
          { cycle: '18', releaseDate: '2022-03-29', eol: '2025-03-29' },
          { cycle: '17', releaseDate: '2020-10-20', eol: '2023-10-20' },
        ],
        Vue: [
          { cycle: '3', releaseDate: '2020-09-18', eol: '2024-03-18' },
          { cycle: '2', releaseDate: '2020-09-18', eol: '2024-03-18' },
        ],
        Angular: [
          { cycle: 'old.16', releaseDate: '2023-05-03', eol: '2024-11-03' },
        ],
      })

      expect(global.fetch).toHaveBeenCalledTimes(2)
      expect(global.fetch).toHaveBeenCalledWith(
        'https://endoflife.date/api/React.json',
      )
      expect(global.fetch).toHaveBeenCalledWith(
        'https://endoflife.date/api/Vue.json',
      )

      expect(setItemSpy).toHaveBeenCalledWith(
        CACHE_KEY,
        JSON.stringify({
          React: {
            data: [
              { cycle: '18', releaseDate: '2022-03-29', eol: '2025-03-29' },
              { cycle: '17', releaseDate: '2020-10-20', eol: '2023-10-20' },
            ],
            timestamp: new Date('2025/03/28 09:00:00').getTime(),
          },
          Vue: {
            data: [
              { cycle: '3', releaseDate: '2020-09-18', eol: '2024-03-18' },
              { cycle: '2', releaseDate: '2020-09-18', eol: '2024-03-18' },
            ],
            timestamp: new Date('2025/03/28 09:00:00').getTime(),
          },
          Angular: {
            data: [
              { cycle: 'old.16', releaseDate: '2023-05-03', eol: '2024-11-03' },
            ],
            timestamp: new Date('2025/03/21 09:00:00').getTime(),
          },
        }),
      )
    })
  })

  // 新レスポンスからバージョンが消えた場合、そのバージョンが localStorage に残り続けてしまうため fetch のタイミングで明示的に消してあげる。
  // toggleProduct 内で localStorage からの削除等を行なっている
  it('初期値としてキャッシュデータが返ること。ただし、選択バージョンのキャッシュが有効期限切れで更新された時、選択バージョンがなくなっていた場合、その選択バージョンを引数として toggleProduct が呼ばれること。', () => {
    const toggleProductMock = vi.fn()
    const setAllProductDetailsMock = vi.fn()

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        React: {
          data: [
            { cycle: '18', releaseDate: '1995-03-29', eol: '1996-03-29' },
            { cycle: '17', releaseDate: '2020-10-20', eol: '2023-10-20' },
            {
              cycle: 'old.selected',
              releaseDate: '2020-10-20',
              eol: '2023-10-20',
            },
          ],
          // システム時刻の1週間前
          timestamp: new Date('2025/03/21 09:00:00').getTime(),
        },
      }),
    )

    renderHook(() =>
      useProductDetails({
        products: mockProductList,
        selectedProducts: ['18', 'old.selected'],
        toggleProduct: toggleProductMock,
        setAllProductDetails: setAllProductDetailsMock,
      }),
    )

    waitFor(() => {
      expect(toggleProductMock).toHaveBeenCalledWith('old.selected')
    })
  })

  it('初期値としてキャッシュデータが返ること。ただし、選択バージョンのキャッシュを更新するための API 通信に失敗した場合、指定プロダクトが旧データのままであること。またキャッシュが更新されないこと', () => {
    const toggleProductMock = vi.fn()
    const setAllProductDetailsMock = vi.fn()

    global.fetch = vi.fn(() => {
      return Promise.reject({
        ok: false,
      })
    }) as Mock

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        React: {
          data: [
            {
              cycle: 'old.18',
              releaseDate: '2022-03-29',
              eol: '2025-03-29',
            },
            {
              cycle: 'old.17',
              releaseDate: '2020-10-20',
              eol: '2023-10-20',
            },
          ],
          // システム時刻のちょうど1週間前
          timestamp: new Date('2025/03/21 09:00:00').getTime(),
        },
      }),
    )

    renderHook(() =>
      useProductDetails({
        products: mockProductList,
        selectedProducts: ['React'],
        toggleProduct: toggleProductMock,
        setAllProductDetails: setAllProductDetailsMock,
      }),
    )

    waitFor(() => {
      expect(setAllProductDetailsMock).toHaveBeenCalledWith({
        React: [
          { cycle: 'old.18', releaseDate: '2022-03-29', eol: '2025-03-29' },
          { cycle: 'old.17', releaseDate: '2020-10-20', eol: '2023-10-20' },
        ],
      })

      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith(
        'https://endoflife.date/api/React.json',
      )

      expect(setItemSpy).not.toHaveBeenCalled()
    })
  })

  it('指定プロダクトのキャッシュ無しの時、API 通信によってデータ取得・更新が行われること。またキャッシュが想定通りの値で更新されること', () => {
    const toggleProductMock = vi.fn()
    const setAllProductDetailsMock = vi.fn()

    const { result } = renderHook(() =>
      useProductDetails({
        products: mockProductList,
        selectedProducts: [],
        toggleProduct: toggleProductMock,
        setAllProductDetails: setAllProductDetailsMock,
      }),
    )

    act(() => {
      result.current.updateProductDetails('React')
    })

    waitFor(() => {
      expect(setAllProductDetailsMock).toHaveBeenCalledWith({
        React: [
          { cycle: '18', releaseDate: '2022-03-29', eol: '2025-03-29' },
          { cycle: '17', releaseDate: '2020-10-20', eol: '2023-10-20' },
        ],
      })

      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith(
        'https://endoflife.date/api/React.json',
      )

      expect(setItemSpy).toHaveBeenCalledWith(
        CACHE_KEY,
        JSON.stringify({
          React: {
            data: [
              { cycle: '18', releaseDate: '2022-03-29', eol: '2025-03-29' },
              { cycle: '17', releaseDate: '2020-10-20', eol: '2023-10-20' },
            ],
            timestamp: new Date('2025/03/22 09:00:00').getTime(),
          },
        }),
      )
    })
  })

  it('指定プロダクトのキャッシュ無しの時、API 通信が失敗した場合、指定プロダクトが空配列になること。またキャッシュが更新されないこと', () => {
    const toggleProductMock = vi.fn()
    const setAllProductDetailsMock = vi.fn()

    global.fetch = vi.fn(() => {
      return Promise.reject({
        ok: false,
      })
    }) as Mock

    const { result } = renderHook(() =>
      useProductDetails({
        products: mockProductList,
        selectedProducts: [],
        toggleProduct: toggleProductMock,
        setAllProductDetails: setAllProductDetailsMock,
      }),
    )

    act(() => {
      result.current.updateProductDetails('React')
    })

    waitFor(() => {
      expect(setAllProductDetailsMock).toHaveBeenCalledWith({
        React: [],
      })

      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith(
        'https://endoflife.date/api/React.json',
      )

      expect(setItemSpy).not.toHaveBeenCalled()
    })
  })

  it('指定プロダクトのキャッシュが有効期限内の時、なにも起こらないこと', () => {
    const toggleProductMock = vi.fn()
    const setAllProductDetailsMock = vi.fn()

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        React: {
          data: [
            {
              cycle: 'old.18',
              releaseDate: '2022-03-29',
              eol: '2025-03-29',
            },
            {
              cycle: 'old.17',
              releaseDate: '2020-10-20',
              eol: '2023-10-20',
            },
          ],
          // システム時刻の23時間59分59秒前
          timestamp: new Date('2025/03/21 09:00:01').getTime(),
        },
      }),
    )

    const { result } = renderHook(() =>
      useProductDetails({
        products: mockProductList,
        selectedProducts: [],
        toggleProduct: toggleProductMock,
        setAllProductDetails: setAllProductDetailsMock,
      }),
    )

    act(() => {
      result.current.updateProductDetails('React')
    })

    waitFor(() => {
      expect(setAllProductDetailsMock).not.toHaveBeenCalled()
      expect(global.fetch).not.toHaveBeenCalled()
      expect(setItemSpy).not.toHaveBeenCalled()
    })
  })

  it('指定プロダクトのキャッシュが有効期限外の時、API 通信によってデータ取得・更新が行われること。またキャッシュが想定通りの値で更新されること', () => {
    const toggleProductMock = vi.fn()
    const setAllProductDetailsMock = vi.fn()

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        React: {
          data: [
            {
              cycle: 'old.18',
              releaseDate: '2022-03-29',
              eol: '2025-03-29',
            },
            {
              cycle: 'old.17',
              releaseDate: '2020-10-20',
              eol: '2023-10-20',
            },
          ],
          // システム時刻のちょうど1週間前
          timestamp: new Date('2025/03/21 09:00:00').getTime(),
        },
      }),
    )

    const { result } = renderHook(() =>
      useProductDetails({
        products: mockProductList,
        selectedProducts: [],
        toggleProduct: toggleProductMock,
        setAllProductDetails: setAllProductDetailsMock,
      }),
    )

    act(() => {
      result.current.updateProductDetails('React')
    })

    waitFor(() => {
      expect(setAllProductDetailsMock).toHaveBeenCalledWith({
        React: [
          { cycle: '18', releaseDate: '2022-03-29', eol: '2025-03-29' },
          { cycle: '17', releaseDate: '2020-10-20', eol: '2023-10-20' },
        ],
      })

      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith(
        'https://endoflife.date/api/React.json',
      )

      expect(setItemSpy).toEqual({
        React: {
          data: [
            { cycle: '18', releaseDate: '2022-03-29', eol: '2025-03-29' },
            { cycle: '17', releaseDate: '2020-10-20', eol: '2023-10-20' },
          ],
          timestamp: new Date('2025/03/22 09:00:00').getTime(),
        },
      })
    })
  })

  it('指定プロダクトのキャッシュが有効期限外で API 通信が失敗した場合、指定プロダクトが旧データのままであること。またキャッシュが更新されないこと', () => {
    const toggleProductMock = vi.fn()
    const setAllProductDetailsMock = vi.fn()

    global.fetch = vi.fn(() => {
      return Promise.reject({
        ok: false,
      })
    }) as Mock

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        React: {
          data: [
            {
              cycle: 'old.18',
              releaseDate: '2022-03-29',
              eol: '2025-03-29',
            },
            {
              cycle: 'old.17',
              releaseDate: '2020-10-20',
              eol: '2023-10-20',
            },
          ],
          // システム時刻のちょうど1週間前
          timestamp: new Date('2025/03/21 09:00:00').getTime(),
        },
      }),
    )

    const { result } = renderHook(() =>
      useProductDetails({
        products: mockProductList,
        selectedProducts: [],
        toggleProduct: toggleProductMock,
        setAllProductDetails: setAllProductDetailsMock,
      }),
    )

    act(() => {
      result.current.updateProductDetails('React')
    })

    waitFor(() => {
      expect(setAllProductDetailsMock).not.toHaveBeenCalled()

      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith(
        'https://endoflife.date/api/React.json',
      )

      expect(setItemSpy).not.toHaveBeenCalled()
    })
  })

  // 空配列=通信失敗時の値（ or レスポンスが空だった時もそうだがあんまないはず）なので再通信しない
  it('指定プロダクトの値が空配列だった時、通信が発生しないこと', () => {
    const toggleProductMock = vi.fn()
    const setAllProductDetailsMock = vi.fn()

    const { result } = renderHook(() =>
      useProductDetails({
        products: {
          ...mockProductList,
          React: [],
        },
        selectedProducts: [],
        toggleProduct: toggleProductMock,
        setAllProductDetails: setAllProductDetailsMock,
      }),
    )

    act(() => {
      result.current.updateProductDetails('React')
    })

    waitFor(() => {
      expect(setAllProductDetailsMock).not.toHaveBeenCalled()

      expect(global.fetch).not.toHaveBeenCalled()

      expect(setItemSpy).not.toHaveBeenCalled()
    })
  })
})
