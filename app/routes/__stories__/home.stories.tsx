import { http, HttpResponse } from 'msw'
import { useEffect } from 'react'
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

const storyWrapper = () => {
  useEffect(() => {
    localStorage.setItem(
      'selectedProducts',
      JSON.stringify(['angular-17', 'react-18', 'react-17', 'react']),
    )
  }, [])

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
}

export const Default: Story = {
  render: storyWrapper,
}
