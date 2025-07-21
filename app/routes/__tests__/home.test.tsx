import { render, screen } from '@testing-library/react'
import { useLoaderData } from 'react-router'

import Home from '../home'

// useLoaderDataをモックする
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLoaderData: jest.fn(),
}))

// useSelectedProductsフックをモックする
jest.mock('~/hooks/useSelectedProducts', () => ({
  useSelectedProducts: jest.fn(() => ({
    selectedProducts: [],
    toggleProduct: jest.fn(),
  })),
}))

// GanttChartコンポーネントをモックする
jest.mock('~/components/ui/ganttChart', () => {
  return {
    __esModule: true,
    default: () => <div>GanttChart Mock</div>,
  }
})

// ProductSidebarコンポーネントをモックする
jest.mock('~/components/ui/productSidebar', () => {
  return {
    __esModule: true,
    ProductSidebar: () => <div>ProductSidebar Mock</div>,
  }
})

describe('Home', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    ;(useLoaderData as jest.Mock).mockClear()
  })

  it('ローダーデータが空の場合でも主要コンポーネントが表示されること', () => {
    // useLoaderDataが空のオブジェクトを返すように設定
    ;(useLoaderData as jest.Mock).mockReturnValue({})
    render(<Home />)
    expect(screen.getByText('Sort by:')).toBeInTheDocument()
    expect(screen.getByText('GanttChart Mock')).toBeInTheDocument()
    expect(screen.getByText('ProductSidebar Mock')).toBeInTheDocument()
  })

  it('ローダーデータが提供された場合に主要コンポーネントが表示されること', () => {
    // useLoaderDataがモックデータを返すように設定
    ;(useLoaderData as jest.Mock).mockReturnValue({
      product1: [
        { cycle: '1.0', releaseDate: '2022-01-01', eol: '2023-01-01' },
      ],
    })
    render(<Home />)
    expect(screen.getByText('Sort by:')).toBeInTheDocument()
    expect(screen.getByText('GanttChart Mock')).toBeInTheDocument()
    expect(screen.getByText('ProductSidebar Mock')).toBeInTheDocument()
  })
})
