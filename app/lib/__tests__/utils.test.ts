import { describe, it, expect, beforeEach, vi } from 'vitest'

import { type GanttTask, type ProductDetails } from '~/lib/types'
// cn関数は状態を持たないので、直接インポートしてテスト
import { cn } from '~/lib/utils'

describe('cn', () => {
  it('複数の引数を結合すること', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  it('falsyな値を無視すること', () => {
    expect(cn('a', false, 'b', null, undefined, 0, 'c')).toBe('a b c')
  })

  it('オブジェクトをクラス名として扱えること', () => {
    expect(cn({ a: true, b: false, c: true })).toBe('a c')
  })

  it('配列をクラス名として扱えること', () => {
    expect(cn(['a', 'b', ['c', { d: true, e: false }]])).toBe('a b c d')
  })

  it('Tailwind CSSのマージができること', () => {
    // `px-2` が `px-4` で上書きされることを期待
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    // `text-red-500` が `text-blue-500` で上書きされることを期待
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('複雑な組み合わせでも正しく動作すること', () => {
    const isActive = true
    const hasError = false
    const className = 'extra-class'

    const result = cn(
      'base-class',
      { 'active-class': isActive, 'error-class': hasError },
      ['p-4', { 'm-2': true }],
      className,
    )

    expect(result).toBe('base-class active-class p-4 m-2 extra-class')
  })
})

describe('convertProductVersionDetailsToGanttTasks', () => {
  let convertProductVersionDetailsToGanttTasks: (
    allProductDetails: ProductDetails,
    selectedProductsSet: Set<string>,
  ) => GanttTask[]

  const mockProductDetails: ProductDetails = {
    react: [
      { cycle: '18', releaseDate: '2022-03-29', eol: '2025-03-29' },
      { cycle: '17', releaseDate: '2020-10-20', eol: '2023-10-20' },
    ],
    vue: [
      { cycle: '3', releaseDate: '2020-09-18', eol: '2024-03-18' },
      { cycle: '2', releaseDate: '2017-09-30', eol: false }, // EOLがfalseの場合
    ],
    angular: [
      { cycle: '17', releaseDate: '2023-11-08', eol: undefined }, // EOLがundefinedの場合
    ],
  }

  beforeEach(async () => {
    // 各テストの前にモジュールをリセットし、再インポートする
    vi.resetModules()
    const utils = await import('~/lib/utils')
    convertProductVersionDetailsToGanttTasks =
      utils.convertProductVersionDetailsToGanttTasks
  })

  it('選択された親製品のすべてのバージョンをガントタスクに変換すること', () => {
    const selectedProductsSet = new Set(['react'])
    const tasks = convertProductVersionDetailsToGanttTasks(
      mockProductDetails,
      selectedProductsSet,
    )

    expect(tasks).toHaveLength(2)
    expect(tasks[0]).toEqual({
      id: '18',
      name: 'react 18',
      productName: 'react',
      start: '2022-03-29',
      end: '2025-03-29',
      progress: 0,
      color: expect.any(String),
    })
    expect(tasks[1]).toEqual({
      id: '17',
      name: 'react 17',
      productName: 'react',
      start: '2020-10-20',
      end: '2023-10-20',
      progress: 0,
      color: expect.any(String),
    })
  })

  it('選択された特定のバージョンのみをガントタスクに変換すること', () => {
    const selectedProductsSet = new Set(['vue-3'])
    const tasks = convertProductVersionDetailsToGanttTasks(
      mockProductDetails,
      selectedProductsSet,
    )

    expect(tasks).toHaveLength(1)
    expect(tasks[0]).toEqual({
      id: '3',
      name: 'vue 3',
      productName: 'vue',
      start: '2020-09-18',
      end: '2024-03-18',
      progress: 0,
      color: expect.any(String),
    })
  })

  it('EOLがfalseの場合、リリース日から1年後の日付をendに設定すること', () => {
    const selectedProductsSet = new Set(['vue-2'])
    const tasks = convertProductVersionDetailsToGanttTasks(
      mockProductDetails,
      selectedProductsSet,
    )

    expect(tasks).toHaveLength(1)
    expect(tasks[0].end).toBe('2018-09-30') // 2017-09-30の1年後
  })

  it('EOLがundefinedの場合、リリース日をendに設定すること', () => {
    const selectedProductsSet = new Set(['angular-17'])
    const tasks = convertProductVersionDetailsToGanttTasks(
      mockProductDetails,
      selectedProductsSet,
    )

    expect(tasks).toHaveLength(1)
    expect(tasks[0].end).toBe('2023-11-08')
  })

  it('選択された製品がない場合、空の配列を返すこと', () => {
    const selectedProductsSet = new Set<string>()
    const tasks = convertProductVersionDetailsToGanttTasks(
      mockProductDetails,
      selectedProductsSet,
    )
    expect(tasks).toHaveLength(0)
  })

  it('製品ごとに一貫した色を割り当てること', () => {
    const selectedProductsSet = new Set(['react', 'vue', 'angular'])
    const tasks = convertProductVersionDetailsToGanttTasks(
      mockProductDetails,
      selectedProductsSet,
    )

    const reactColor = tasks.find((t) => t.productName === 'react')?.color
    const vueColor = tasks.find((t) => t.productName === 'vue')?.color
    const angularColor = tasks.find((t) => t.productName === 'angular')?.color

    expect(reactColor).toBeDefined()
    expect(vueColor).toBeDefined()
    expect(angularColor).toBeDefined()
    expect(reactColor).not.toEqual(vueColor)
    expect(reactColor).not.toEqual(angularColor)
    expect(vueColor).not.toEqual(angularColor)
  })

  it('同じ製品のバージョンは同じ色を持つこと', () => {
    const selectedProductsSet = new Set(['react', 'react-18', 'react-17'])
    const tasks = convertProductVersionDetailsToGanttTasks(
      mockProductDetails,
      selectedProductsSet,
    )

    const react18Color = tasks.find((t) => t.id === '18')?.color
    const react17Color = tasks.find((t) => t.id === '17')?.color

    expect(react18Color).toBeDefined()
    expect(react17Color).toBeDefined()
    expect(react18Color).toEqual(react17Color)
  })

  it('カスタム製品が正しく処理されること', () => {
    const customProductDetails: ProductDetails = {
      custom: [{ cycle: '1.0', releaseDate: '2023-01-01', eol: '2024-01-01' }],
    }
    const selectedProductsSet = new Set(['custom'])
    const tasks = convertProductVersionDetailsToGanttTasks(
      customProductDetails,
      selectedProductsSet,
    )

    expect(tasks).toHaveLength(1)
    expect(tasks[0]).toEqual({
      id: '1.0',
      name: 'custom 1.0',
      productName: 'custom',
      start: '2023-01-01',
      end: '2024-01-01',
      progress: 0,
      color: expect.any(String),
    })
  })
})
