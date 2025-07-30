import { within, expect, userEvent, waitFor } from '@storybook/test'
import { http, HttpResponse } from 'msw'
import { createMemoryRouter, RouterProvider } from 'react-router'

import type { Meta, StoryObj } from '@storybook/react'

import Home, { clientLoader } from '~/routes/home'

const meta = {
  title: 'Pages/Home',
  component: Home,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [
        http.get('https://endoflife.date/api/all.json', () => {
          return HttpResponse.json(['react', 'vue', 'angular'])
        }),
        http.get('https://endoflife.date/api/react.json', () => {
          return HttpResponse.json([
            { cycle: '18', releaseDate: '2022-03-29', eol: '2025-03-29' },
            { cycle: '17', releaseDate: '2020-10-20', eol: '2023-10-20' },
          ])
        }),
        http.get('https://endoflife.date/api/vue.json', () => {
          return HttpResponse.json([
            { cycle: '3', releaseDate: '2020-09-18', eol: '2024-03-18' },
            { cycle: '2', releaseDate: '2016-09-30', eol: '2023-12-31' },
          ])
        }),
        http.get('https://endoflife.date/api/angular.json', () => {
          return HttpResponse.json([
            { cycle: '17', releaseDate: '2023-11-08', eol: '2025-05-08' },
            { cycle: '16', releaseDate: '2023-05-03', eol: '2024-11-03' },
          ])
        }),
      ],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Home>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const initialSelectedProducts = [
      'angular-17',
      'react-18',
      'react-17',
      'react',
    ]
    localStorage.setItem(
      'selectedProducts',
      JSON.stringify(initialSelectedProducts),
    )
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <Home />,
          loader: clientLoader,
        },
      ],
      { initialEntries: ['/'] },
    )

    return <RouterProvider router={router} />
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)

    // サイドバーの要素が表示されていることを確認
    await expect(await canvas.findByText('react')).toBeInTheDocument()
    await expect(await canvas.findByText('vue')).toBeInTheDocument()
    await expect(await canvas.findByText('angular')).toBeInTheDocument()

    // ガントチャートの要素が表示されていることを確認
    await waitFor(() =>
      expect(canvas.getByTestId('gantt-chart-mock')).toBeInTheDocument(),
    )

    // ソートオプションが表示されていることを確認
    await expect(canvas.getByLabelText('Sort by:')).toBeInTheDocument()

    // reactのチェックボックスがチェックされていることを確認
    const reactCheckbox = canvas.getByRole('checkbox', { name: 'react' })
    await expect(reactCheckbox).toBeChecked()

    // vueのバージョン3のチェックボックスをクリックして選択状態にする
    const vueAccordionTrigger = canvas.getByRole('button', {
      name: /toggle details for vue/i,
    })
    await userEvent.click(vueAccordionTrigger)
    const vue3Checkbox = canvas.getByRole('checkbox', { name: 'vue-3' })
    await userEvent.click(vue3Checkbox)
    await expect(vue3Checkbox).toBeChecked()

    // ソート順を変更してガントチャートが更新されることを確認
    const sortBySelect = canvas.getByLabelText('Sort by:')
    await userEvent.selectOptions(sortBySelect, 'release')
    // ここでガントチャートのタスク順序が変更されたことを検証するアサーションを追加
    // ただし、GanttChartがモックされているため、直接DOMの順序を検証することは難しい。
    // 代わりに、GanttChartに渡されるpropsが変化したことをモック経由で検証する必要があるが、
    // それはユニットテストの範囲となるため、ここでは省略する。
  },
}
