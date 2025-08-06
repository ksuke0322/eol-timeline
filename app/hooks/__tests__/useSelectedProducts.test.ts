import { renderHook, act } from '@testing-library/react'
import { type Mock } from 'vitest'

import { useSelectedProducts } from '../useSelectedProducts'

import { type ProductDetails } from '~/lib/types'

describe('useSelectedProducts', () => {
  const mockAllProducts: ProductDetails = {
    product1: [
      { cycle: '1.0', releaseDate: '', eol: '' },
      { cycle: '1.1', releaseDate: '', eol: '' },
    ],
    product2: [
      { cycle: '2.0', releaseDate: '', eol: '' },
      { cycle: '2.1', releaseDate: '', eol: '' },
    ],
  }

  beforeEach(() => {
    localStorage.clear()
    // console.errorのモック化
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    // モックを元に戻す
    ;(console.error as Mock).mockRestore()
  })

  it('初期状態では選択された製品はないこと', () => {
    const { result } = renderHook(() => useSelectedProducts(mockAllProducts))
    expect(result.current.selectedProducts).toEqual([])
  })

  it('製品（親）を選択・選択解除できること', () => {
    const { result } = renderHook(() => useSelectedProducts(mockAllProducts))

    act(() => {
      result.current.toggleProduct('product1')
    })
    expect(result.current.selectedProducts).toEqual(
      expect.arrayContaining(['product1', 'product1_1.0', 'product1_1.1']),
    )

    act(() => {
      result.current.toggleProduct('product1')
    })
    expect(result.current.selectedProducts).toEqual([]) // 親と子の選択が解除される
  })

  it('バージョン（子）を選択・選択解除できること', () => {
    const { result } = renderHook(() => useSelectedProducts(mockAllProducts))

    act(() => {
      result.current.toggleProduct('product1_1.0')
    })
    expect(result.current.selectedProducts).toEqual(['product1_1.0'])

    act(() => {
      result.current.toggleProduct('product1_1.0')
    })
    expect(result.current.selectedProducts).toEqual([])
  })

  it('全てのバージョンを選択すると製品（親）も選択されること', () => {
    const { result } = renderHook(() => useSelectedProducts(mockAllProducts))

    act(() => {
      result.current.toggleProduct('product1_1.0')
    })
    act(() => {
      result.current.toggleProduct('product1_1.1')
    })

    // 親プロダクトが自動的に選択されることを確認
    expect(result.current.selectedProducts).toEqual(
      expect.arrayContaining(['product1', 'product1_1.0', 'product1_1.1']),
    )
    expect(result.current.selectedProducts.length).toBe(3)
  })

  it('親が選択された状態でバージョンを1つ解除すると親の選択も解除されること', () => {
    const { result } = renderHook(() => useSelectedProducts(mockAllProducts))

    // 最初に親を選択
    act(() => {
      result.current.toggleProduct('product1')
    })
    expect(result.current.selectedProducts).toEqual(
      expect.arrayContaining(['product1', 'product1_1.0', 'product1_1.1']),
    )

    // バージョンを1つ選択解除
    act(() => {
      result.current.toggleProduct('product1_1.0')
    })

    // 親プロダクトの選択が解除されることを確認
    expect(result.current.selectedProducts).toEqual(['product1_1.1'])
  })

  it('存在しないIDをトグルしても状態は変わらないこと', () => {
    const { result } = renderHook(() => useSelectedProducts(mockAllProducts))
    const initialSelection = result.current.selectedProducts

    act(() => {
      result.current.toggleProduct('non-existent-id')
    })

    // 配列の参照が変わっていないことを確認
    expect(result.current.selectedProducts).toStrictEqual(initialSelection)
    expect(result.current.selectedProducts).toEqual([])
  })

  it('LocalStorageから初期状態を復元できること', () => {
    localStorage.setItem(
      'selectedProducts',
      JSON.stringify(['product1', 'product1_1.0']),
    )
    const { result } = renderHook(() => useSelectedProducts(mockAllProducts))
    expect(result.current.selectedProducts).toEqual([
      'product1',
      'product1_1.0',
    ])
  })

  it('LocalStorageのデータが不正な場合に初期状態が空配列になること', () => {
    localStorage.setItem('selectedProducts', 'invalid-json')
    const { result } = renderHook(() => useSelectedProducts(mockAllProducts))
    expect(result.current.selectedProducts).toEqual([])
    // console.errorが呼び出されたことを確認
    expect(console.error).toHaveBeenCalled()
  })

  it('状態の変更がLocalStorageに保存されること', () => {
    const { result } = renderHook(() => useSelectedProducts(mockAllProducts))

    act(() => {
      result.current.toggleProduct('product1')
    })

    expect(localStorage.getItem('selectedProducts')).toBe(
      JSON.stringify(['product1', 'product1_1.0', 'product1_1.1']),
    )
  })

  describe('カスタムデータが存在する場合', () => {
    const customProducts: ProductDetails = {
      custom1: [{ cycle: 'c1', releaseDate: '', eol: '' }],
    }

    it('カスタム製品を選択・解除できること', () => {
      const { result } = renderHook(() =>
        useSelectedProducts(mockAllProducts, customProducts),
      )

      act(() => {
        result.current.toggleProduct('custom1')
      })
      expect(result.current.selectedProducts).toEqual(['custom1', 'custom1_c1'])

      act(() => {
        result.current.toggleProduct('custom1')
      })
      expect(result.current.selectedProducts).toEqual([])
    })

    it('通常製品とカスタム製品を同時に選択できること', () => {
      const { result } = renderHook(() =>
        useSelectedProducts(mockAllProducts, customProducts),
      )

      act(() => {
        result.current.toggleProduct('product1')
      })
      act(() => {
        result.current.toggleProduct('custom1')
      })

      expect(result.current.selectedProducts).toEqual(
        expect.arrayContaining([
          'product1',
          'product1_1.0',
          'product1_1.1',
          'custom1',
          'custom1_c1',
        ]),
      )
    })
  })

  describe('全選択・全解除', () => {
    const customProducts: ProductDetails = {
      custom1: [{ cycle: 'c1', releaseDate: '', eol: '' }],
    }

    it('全選択ですべての製品が選択されること', () => {
      const { result } = renderHook(() =>
        useSelectedProducts(mockAllProducts, customProducts),
      )

      act(() => {
        result.current.selectAllProducts()
      })

      expect(result.current.selectedProducts).toEqual(
        expect.arrayContaining([
          'product1',
          'product1_1.0',
          'product1_1.1',
          'product2',
          'product2_2.0',
          'product2_2.1',
          'custom1',
          'custom1_c1',
        ]),
      )
    })

    it('全解除ですべての選択がクリアされること', () => {
      const { result } = renderHook(() =>
        useSelectedProducts(mockAllProducts, customProducts),
      )

      act(() => {
        result.current.clearAllProducts()
      })

      expect(result.current.selectedProducts).toEqual([])
    })
  })
})
