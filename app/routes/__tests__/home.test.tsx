import { render, screen, fireEvent } from '@testing-library/react'
import { useLoaderData } from 'react-router'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'

import Home from '../home'

import type { GanttTask, ProductDetails } from '~/lib/types'

// --- Mocks ---
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

const mockProductDetails: ProductDetails = {
  react: [
    { cycle: '18', releaseDate: '2022-03-29', eol: '2025-03-29' },
    { cycle: '17', releaseDate: '2020-10-20', eol: '2023-10-20' },
  ],
  vue: [{ cycle: '3', releaseDate: '2020-09-18', eol: '2024-03-18' }],
}

describe('Home Component Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    ganttTasks = []
    ;(useLoaderData as Mock).mockReturnValue(mockProductDetails)
  })

  it('製品データがサイドバーに正しく表示されること', async () => {
    render(<Home />)
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('vue')).toBeInTheDocument()

    // アコーディオンを開いてバージョンが表示されることを確認
    fireEvent.click(
      screen.getByRole('button', { name: /toggle details for react/i }),
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

    // アコーディオンを開いて "vue" のバージョンをクリック
    fireEvent.click(
      screen.getByRole('button', { name: /toggle details for vue/i }),
    )
    fireEvent.click(screen.getByRole('checkbox', { name: 'vue-3' }))

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
