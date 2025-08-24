import { within, expect, userEvent, waitFor } from '@storybook/test'
import { http, HttpResponse } from 'msw'
import { createMemoryRouter, RouterProvider } from 'react-router'

import type { Meta, StoryObj } from '@storybook/react-vite'

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
            { cycle: '18', releaseDate: '2022-03-29', support: '2025-03-29' },
            { cycle: '17', releaseDate: '2020-10-20', support: '2023-10-20' },
          ])
        }),
        http.get('https://endoflife.date/api/vue.json', () => {
          return HttpResponse.json([
            { cycle: '3', releaseDate: '2020-09-18', support: '2024-03-18' },
            { cycle: '2', releaseDate: '2016-09-30', support: '2023-12-31' },
          ])
        }),
        http.get('https://endoflife.date/api/angular.json', () => {
          return HttpResponse.json([
            { cycle: '17', releaseDate: '2023-11-08', support: '2025-05-08' },
            { cycle: '16', releaseDate: '2023-05-03', support: '2024-11-03' },
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
  // ganttChart の select は外部依存から提供されているため aria-label を後付けで付与している。
  // 通信によって後付けが遅れてしまい a11y の問題がご検知されてしまう
  // またこの部分のチェックは ganttChart.stories.tsx で行えているためここではテストはスキップとする。
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'select-name',
            selector: '.viewmode-select',
            enabled: false,
          },
        ],
      },
    },
  },
  render: () => {
    const initialSelectedProducts = [
      'angular_17',
      'react_18',
      'react_17',
      'react',
    ]
    localStorage.setItem(
      'selectedProducts',
      JSON.stringify(initialSelectedProducts),
    )
    localStorage.setItem(
      'eol_products_details_cache',
      JSON.stringify({
        react: {
          data: [
            { cycle: '18', releaseDate: '2022-03-29', support: '2025-03-29' },
            { cycle: '17', releaseDate: '2020-10-20', support: '2023-10-20' },
          ],
          timestamp: Date.now(),
        },
        vue: {
          data: [
            { cycle: '3', releaseDate: '2020-09-18', support: '2024-03-18' },
            { cycle: '2', releaseDate: '2016-09-30', support: '2023-12-31' },
          ],
          timestamp: Date.now(),
        },
        angular: {
          data: [
            { cycle: '17', releaseDate: '2023-11-08', support: '2025-05-08' },
            { cycle: '16', releaseDate: '2023-05-03', support: '2024-11-03' },
          ],
          timestamp: Date.now(),
        },
      }),
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
      expect(canvas.getByTestId('gantt-chart')).toBeInTheDocument(),
    )

    // ソートオプションが表示されていることを確認
    await expect(canvas.getByLabelText('Sort by:')).toBeInTheDocument()

    // reactのチェックボックスがチェックされていることを確認
    const reactCheckbox = canvas.getByRole('checkbox', { name: 'react' })
    await expect(reactCheckbox).toBeChecked()

    await userEvent.click(
      canvas.getByRole('button', {
        name: /toggle details for vue/i,
      }),
    )

    const vue3Checkbox = canvas.getByRole('checkbox', { name: 'vue_3' })
    await userEvent.click(vue3Checkbox)
    await expect(vue3Checkbox).toBeChecked()

    // ソート順を変更してガントチャートが更新されることを確認
    const sortBySelect = canvas.getByLabelText('Sort by:')
    await userEvent.selectOptions(sortBySelect, 'release')
  },
}
