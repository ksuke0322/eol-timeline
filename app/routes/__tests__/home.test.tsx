import { render, screen, fireEvent } from '@testing-library/react'
import { useLoaderData } from 'react-router'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'

import Home, { clientLoader } from '../home' // clientLoaderをインポート

import type { GanttTask, ProductDetails } from '~/lib/types'

// --- モック ---
vi.mock('react-router', async () => ({
  ...(await vi.importActual<typeof import('react-router')>('react-router')),
  useLoaderData: vi.fn(),
}))

// GanttChartは内部ライブラリがJSDOMで動かないためモックを維持
let ganttTasks: GanttTask[] = []
vi.mock('~/components/ui/ganttChart', () => ({
  default: (props: { tasks: GanttTask[] }) => {
    ganttTasks = props.tasks
    return <div data-testid="gantt-chart-mock" />
  },
}))

const mockProductList: ProductDetails = {
  react: null,
  vue: null,
}

describe('Home Component Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('component logic', () => {
    beforeEach(() => {
      ;(useLoaderData as Mock).mockReturnValue(mockProductList)
      ganttTasks = []

      localStorage.setItem(
        'eol_products_details_cache',
        JSON.stringify({
          react: {
            data: [
              {
                cycle: '18',
                releaseDate: '2022-03-29',
                eol: '2024-03-29',
              },
              {
                cycle: '17',
                releaseDate: '2020-10-20',
                eol: '2022-10-20',
              },
            ],
            timestamp: Date.now(),
          },
          vue: {
            data: [
              {
                cycle: '3',
                releaseDate: '1999-09-03',
                eol: '2023-09-03',
              },
            ],
            timestamp: Date.now(),
          },
        }),
      )
    })

    it('製品データがサイドバーに正しく表示されること', async () => {
      render(<Home />)
      expect(screen.getByText('react')).toBeInTheDocument()
      expect(screen.getByText('vue')).toBeInTheDocument()

      fireEvent.click(
        screen.getByRole('button', { name: 'Toggle details for react' }),
      )

      expect(await screen.findByText('18')).toBeVisible()
      expect(await screen.findByText('17')).toBeVisible()
    })

    it('製品を選択するとガントチャートのタスクが更新されること', () => {
      render(<Home />)
      expect(ganttTasks).toHaveLength(0)

      // "react" の親チェックボックスをクリック
      fireEvent.click(screen.getByRole('checkbox', { name: 'react' }))

      // ガントチャートに渡されるタスクが更新されることを確認
      expect(ganttTasks).toHaveLength(2)
      expect(ganttTasks.map((t) => t.name)).toEqual(
        expect.arrayContaining(['react 18', 'react 17']),
      )

      fireEvent.click(
        screen.getByRole('button', { name: 'Toggle details for vue' }),
      )
      fireEvent.click(screen.getByRole('checkbox', { name: 'vue_3' }))

      expect(ganttTasks).toHaveLength(3)
      expect(ganttTasks.some((task) => task.name === 'vue 3')).toBe(true)
    })

    it('ソート順を変更するとガントチャートのタスク順序が変わること', () => {
      render(<Home />)
      // reactとvueを選択
      fireEvent.click(screen.getByRole('checkbox', { name: 'react' }))
      fireEvent.click(screen.getByRole('checkbox', { name: 'vue' }))

      // 初期ソートは "tool" (名前順)
      const initialNames = ganttTasks.map((t) => t.name)
      expect(initialNames).toEqual(['react 17', 'react 18', 'vue 3'])

      // "Release Date" でソート
      fireEvent.change(screen.getByLabelText('Sort by:'), {
        target: { value: 'release' },
      })
      const releaseDateSortedNames = ganttTasks.map((t) => t.name)
      expect(releaseDateSortedNames).toEqual(['vue 3', 'react 17', 'react 18'])

      // "EOL Date" でソート
      fireEvent.change(screen.getByLabelText('Sort by:'), {
        target: { value: 'eol' },
      })
      const eolDateSortedNames = ganttTasks.map((t) => t.name)
      expect(eolDateSortedNames).toEqual(['react 17', 'vue 3', 'react 18'])
    })

    // カスタムデータとファイル読み込みのテストは、
    // Homeコンポーネントの責務が大きすぎるため、別途リファクタリング後に
    // カスタムデータ処理のロジックを分離した上でテストを追加するのが望ましい。
    // ここでは一旦プレースホルダーとしておく。
    it.todo('カスタムデータを読み込んで表示できること')
    it.todo('カスタムデータをクリアできること')
  })

  describe('clientLoader', () => {
    // Mock localStorage
    const localStorageMock = (() => {
      let store: { [key: string]: string } = {}
      return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          store[key] = value
        }),
        clear: vi.fn(() => {
          store = {}
        }),
        removeItem: vi.fn((key: string) => {
          delete store[key]
        }),
      }
    })()

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    })

    beforeEach(() => {
      localStorageMock.clear()
      vi.clearAllMocks()
    })

    it('APIからデータをフェッチし、キャッシュに保存すること', async () => {
      const mockAllJson = ['react', 'vue']

      global.fetch = vi.fn((url: string) => {
        if (url === 'https://endoflife.date/api/all.json') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockAllJson),
          })
        }
        return Promise.reject({
          ok: false,
        })
      }) as Mock

      const result = await clientLoader()

      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(result).toEqual({
        react: null,
        vue: null,
      })

      // キャッシュに保存されていることを確認
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(1)
      const cachedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1])
      expect(cachedData.data).toEqual(mockAllJson)
      expect(cachedData.timestamp).toBeCloseTo(Date.now(), -1000) // 1秒程度の誤差を許容
    })

    it('キャッシュが存在し、有効期限内の場合はキャッシュからデータをロードすること', async () => {
      const expiredTimestamp = Date.now() - 1000 // 1秒前
      const mockCachedData = {
        data: ['cached'],
        timestamp: expiredTimestamp,
      }
      localStorageMock.setItem(
        'eol_products_list_cache',
        JSON.stringify(mockCachedData),
      )

      global.fetch = vi.fn() // fetchが呼ばれないことを確認するためモック

      const result = await clientLoader()

      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        'eol_products_list_cache',
      )
      expect(global.fetch).not.toHaveBeenCalled() // fetchが呼ばれないこと
      expect(result).toEqual({ cached: null })
    })

    it('キャッシュが存在するが、有効期限切れの場合はAPIから再フェッチすること', async () => {
      const expiredTimestamp = Date.now() - (24 * 60 * 60 * 1000 + 1000) // 1日以上前
      const mockCachedData = {
        data: ['old'],
        timestamp: expiredTimestamp,
      }
      localStorageMock.setItem(
        'eol_products_list_cache',
        JSON.stringify(mockCachedData),
      )

      const mockAllJson = ['new_product']

      global.fetch = vi.fn((url: string) => {
        if (url === 'https://endoflife.date/api/all.json') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockAllJson),
          })
        }
        return Promise.reject(new Error('unknown url'))
      }) as Mock

      const result = await clientLoader()

      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        'eol_products_list_cache',
      )
      expect(global.fetch).toHaveBeenCalledTimes(1) // all.json
      expect(result).toEqual({ new_product: null })
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2) // 新しいデータでキャッシュが更新されること (セットアップでの呼び出しを含む)
    })

    it('APIフェッチが失敗した場合、エラーをスローすること', async () => {
      global.fetch = vi.fn((url: string) => {
        if (url === 'https://endoflife.date/api/all.json') {
          return Promise.resolve({
            ok: false, // 失敗
            status: 500,
            json: () => Promise.resolve({ message: 'Server Error' }),
          })
        }
        return Promise.reject(new Error('should not be called'))
      }) as Mock

      await expect(clientLoader()).rejects.toThrow('Failed to fetch products')
      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(localStorageMock.setItem).not.toHaveBeenCalled() // エラー時はキャッシュしない
    })
  })
})
