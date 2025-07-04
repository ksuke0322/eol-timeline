import { renderHook, act } from '@testing-library/react'

import { useSelectedProducts } from '../use-selected-products'

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
  })

  it('初期状態では選択された製品はないこと', () => {
    const { result } = renderHook(() => useSelectedProducts(mockAllProducts))
    expect(result.current.selectedProducts).toEqual([])
  })

  it('製品を選択・選択解除できること', () => {
    const { result } = renderHook(() => useSelectedProducts(mockAllProducts))

    act(() => {
      result.current.toggleProduct('product1')
    })
    expect(result.current.selectedProducts).toEqual([
      'product1',
      'product1-1.0',
      'product1-1.1',
    ])

    act(() => {
      result.current.toggleProduct('product2')
    })
    expect(result.current.selectedProducts).toEqual([
      'product1',
      'product1-1.0',
      'product1-1.1',
      'product2',
      'product2-2.0',
      'product2-2.1',
    ])

    act(() => {
      result.current.toggleProduct('product1')
    })
    expect(result.current.selectedProducts).toEqual([
      'product2',
      'product2-2.0',
      'product2-2.1',
    ])
  })

  it('すべての製品を選択できること', () => {
    const { result } = renderHook(() => useSelectedProducts(mockAllProducts))

    act(() => {
      result.current.selectAll(['product1', 'product2'])
    })

    expect(result.current.selectedProducts).toEqual([
      'product1',
      'product1-1.0',
      'product1-1.1',
      'product2',
      'product2-2.0',
      'product2-2.1',
    ])
  })

  it('すべての製品の選択を解除できること', () => {
    const { result } = renderHook(() => useSelectedProducts(mockAllProducts))

    act(() => {
      result.current.selectAll(['product1', 'product2'])
    })

    act(() => {
      result.current.deselectAll()
    })

    expect(result.current.selectedProducts).toEqual([])
  })

  it('LocalStorageから初期状態を復元できること', () => {
    localStorage.setItem(
      'selectedProducts',
      JSON.stringify(['product1', 'product1-1.0']),
    )
    const { result } = renderHook(() => useSelectedProducts(mockAllProducts))
    expect(result.current.selectedProducts).toEqual([
      'product1',
      'product1-1.0',
    ])
  })

  it('状態の変更がLocalStorageに保存されること', () => {
    const { result } = renderHook(() => useSelectedProducts(mockAllProducts))

    act(() => {
      result.current.toggleProduct('product1')
    })

    expect(localStorage.getItem('selectedProducts')).toBe(
      JSON.stringify(['product1', 'product1-1.0', 'product1-1.1']),
    )
  })
})
