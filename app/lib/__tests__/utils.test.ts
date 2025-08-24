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
      { cycle: '18', releaseDate: '2022-03-29', support: '2025-03-29' },
      { cycle: '17', releaseDate: '2020-10-20', support: '2023-10-20' },
    ],
    vue: [
      { cycle: '3', releaseDate: '2020-09-18', support: '2024-03-18' },
      { cycle: '2', releaseDate: '2017-09-30', support: false },
      {
        cycle: '1.support',
        releaseDate: '2017-09-30',
        support: '2024-03-18',
      }, // support優先される
      {
        cycle: '1.eol',
        releaseDate: '2017-09-30',
        eol: '2024-03-18',
      }, // eol優先される
    ],
    angular: [
      { cycle: '16', releaseDate: '2023-11-08', support: true, eol: false }, // supportがtrueの場合
      { cycle: '16', releaseDate: '2023-11-08', support: false, eol: true }, // eolがtrueの場合
      { cycle: '15', releaseDate: '2023-11-08' }, // どっちもない
      { cycle: '15', releaseDate: '2023-11-08', eol: true }, // support なし
      { cycle: '15', releaseDate: '2023-11-08', support: true }, // eol なし
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
      eol_status: 0,
    })
    expect(tasks[1]).toEqual({
      id: '17',
      name: 'react 17',
      productName: 'react',
      start: '2020-10-20',
      end: '2023-10-20',
      progress: 0,
      color: expect.any(String),
      eol_status: 0,
    })
  })

  it('選択された特定のバージョンのみをガントタスクに変換すること', () => {
    const selectedProductsSet = new Set(['vue_3'])
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
      eol_status: 0,
    })
  })

  it.each([
    {
      support: '2025-03-29',
      eol: '2025-03-28',
      end: '2025-03-29',
      eol_status: 0,
      name: '',
    },
    {
      support: '2025-03-29',
      eol: false,
      end: '2025-03-29',
      eol_status: 0,
      name: '',
    },
    {
      support: '2025-03-29',
      eol: true,
      end: '2025-03-29',
      eol_status: 0,
      name: '',
    },
    {
      support: '2025-03-29',
      eol: undefined,
      end: '2025-03-29',
      eol_status: 0,
      name: '',
    },
    {
      support: false,
      eol: '2025-03-29',
      end: '2025-03-29',
      eol_status: 0,
      name: '',
    },
    {
      support: false,
      eol: false,
      end: '2020-09-18',
      eol_status: 1,
      name: ' |----------> Support',
    },
    {
      support: false,
      eol: true,
      end: '2020-09-18',
      eol_status: 2,
      name: ' | EOL',
    },
    {
      support: false,
      eol: undefined,
      end: '2020-09-18',
      eol_status: 2,
      name: ' | EOL',
    },
    {
      support: true,
      eol: '2025-03-29',
      end: '2025-03-29',
      eol_status: 0,
      name: '',
    },
    {
      support: true,
      eol: false,
      end: '2020-09-18',
      eol_status: 1,
      name: ' |----------> Support',
    },
    {
      support: true,
      eol: true,
      end: '2020-09-18',
      eol_status: 1,
      name: ' |----------> Support',
    },
    {
      support: true,
      eol: undefined,
      end: '2020-09-18',
      eol_status: 1,
      name: ' |----------> Support',
    },
    {
      support: undefined,
      eol: '2025-03-29',
      end: '2025-03-29',
      eol_status: 0,
      name: '',
    },
    {
      support: undefined,
      eol: false,
      end: '2020-09-18',
      eol_status: 1,
      name: ' |----------> Support',
    },
    {
      support: undefined,
      eol: true,
      end: '2020-09-18',
      eol_status: 2,
      name: ' | EOL',
    },
    {
      support: undefined,
      eol: undefined,
      end: '2020-09-18',
      eol_status: 2,
      name: ' | EOL',
    },
  ])(
    'プロダクト全体が選択されている場合 => support:$support, eol:$eol => end:$end, eol_status:$eol_status, name:$name',
    ({ support, eol, end, eol_status, name }) => {
      const productDetails: ProductDetails = {
        testProduct: [
          { cycle: '1', releaseDate: '2020-09-18', support, eol },
          { cycle: '2', releaseDate: '2020-09-20', support, eol },
        ],
      }
      const selectedProductsSet = new Set(['testProduct', 'testProduct_1'])
      const tasks = convertProductVersionDetailsToGanttTasks(
        productDetails,
        selectedProductsSet,
      )

      expect(tasks).toHaveLength(2)
      expect(tasks[0].end).toBe(end)
      expect(tasks[0].eol_status).toBe(eol_status)
      expect(tasks[0].name).toBe(`testProduct 1${name}`)
    },
  )

  it.each([
    {
      support: '2025-03-29',
      eol: '2025-03-28',
      end: '2025-03-29',
      eol_status: 0,
      name: '',
    },
    {
      support: '2025-03-29',
      eol: false,
      end: '2025-03-29',
      eol_status: 0,
      name: '',
    },
    {
      support: '2025-03-29',
      eol: true,
      end: '2025-03-29',
      eol_status: 0,
      name: '',
    },
    {
      support: '2025-03-29',
      eol: undefined,
      end: '2025-03-29',
      eol_status: 0,
      name: '',
    },
    {
      support: false,
      eol: '2025-03-29',
      end: '2025-03-29',
      eol_status: 0,
      name: '',
    },
    {
      support: false,
      eol: false,
      end: '2020-09-18',
      eol_status: 1,
      name: ' |----------> Support',
    },
    {
      support: false,
      eol: true,
      end: '2020-09-18',
      eol_status: 2,
      name: ' | EOL',
    },
    {
      support: false,
      eol: undefined,
      end: '2020-09-18',
      eol_status: 2,
      name: ' | EOL',
    },
    {
      support: true,
      eol: '2025-03-29',
      end: '2025-03-29',
      eol_status: 0,
      name: '',
    },
    {
      support: true,
      eol: false,
      end: '2020-09-18',
      eol_status: 1,
      name: ' |----------> Support',
    },
    {
      support: true,
      eol: true,
      end: '2020-09-18',
      eol_status: 1,
      name: ' |----------> Support',
    },
    {
      support: true,
      eol: undefined,
      end: '2020-09-18',
      eol_status: 1,
      name: ' |----------> Support',
    },
    {
      support: undefined,
      eol: '2025-03-29',
      end: '2025-03-29',
      eol_status: 0,
      name: '',
    },
    {
      support: undefined,
      eol: false,
      end: '2020-09-18',
      eol_status: 1,
      name: ' |----------> Support',
    },
    {
      support: undefined,
      eol: true,
      end: '2020-09-18',
      eol_status: 2,
      name: ' | EOL',
    },
    {
      support: undefined,
      eol: undefined,
      end: '2020-09-18',
      eol_status: 2,
      name: ' | EOL',
    },
  ])(
    'バージョン単体が選択されている場合 => support:$support, eol:$eol => end:$end, eol_status:$eol_status, name:$name',
    ({ support, eol, end, eol_status, name }) => {
      const productDetails: ProductDetails = {
        testProduct: [{ cycle: '1', releaseDate: '2020-09-18', support, eol }],
      }
      const selectedProductsSet = new Set(['testProduct_1'])
      const tasks = convertProductVersionDetailsToGanttTasks(
        productDetails,
        selectedProductsSet,
      )

      expect(tasks).toHaveLength(1)
      expect(tasks[0].end).toBe(end)
      expect(tasks[0].eol_status).toBe(eol_status)
      expect(tasks[0].name).toBe(`testProduct 1${name}`)
    },
  )

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
    const selectedProductsSet = new Set(['react', 'react_18', 'react_17'])
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
      custom: [
        { cycle: '1.0', releaseDate: '2023-01-01', support: '2024-01-01' },
      ],
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
      eol_status: 0,
    })
  })
})
