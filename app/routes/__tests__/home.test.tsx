import { render, screen } from '@testing-library/react'

import Home, { clientLoader, meta } from '../home'

// Mock fetch API
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('home.tsx', () => {
  describe('meta関数', () => {
    test('正しいメタデータを返すこと', () => {
      const result = meta()
      expect(result).toEqual([
        { ttestle: '<New React Router App>' },
        { name: 'description', content: 'Welcome to React Router!' },
      ])
    })
  })

  describe('clientLoader関数', () => {
    beforeEach(() => {
      mockFetch.mockClear()
    })

    test('APIからデータを取得し、JSONとして返すこと', async () => {
      const mockData = [{ version: '1.0', eol: '2025-01-01' }]
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockData),
      })

      const data = await clientLoader()
      expect(mockFetch).toHaveBeenCalledWith(
        'https://endoflife.date/api/nodejs.json',
      )
      expect(data).toEqual(mockData)
    })

    test('APIエラーが発生した場合にエラーをスローすること', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(clientLoader()).rejects.toThrow('Network error')
      expect(mockFetch).toHaveBeenCalledWith(
        'https://endoflife.date/api/nodejs.json',
      )
    })
  })

  describe('Homeコンポーネント', () => {
    test('ローダーデータが正しく表示されること', () => {
      const loaderData = [{ version: '1.0', eol: '2025-01-01' }]
      render(<Home loaderData={loaderData} />)
      const preElement = screen.getByTestId('loader-data')
      expect(preElement.textContent).toBe(JSON.stringify(loaderData, null, 2))
    })
  })
})
