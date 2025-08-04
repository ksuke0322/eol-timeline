import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'

import { ProductSidebar } from '~/components/ui/productSidebar'
import { type ProductDetails } from '~/lib/types'

const mockProducts: ProductDetails = {
  React: [
    { cycle: '18', releaseDate: '2022-03-29', eol: '2025-03-29' },
    { cycle: '17', releaseDate: '2020-10-20', eol: '2023-10-20' },
  ],
  Vue: [{ cycle: '3', releaseDate: '2020-09-18', eol: '2024-03-18' }],
  Angular: [{ cycle: '16', releaseDate: '2023-05-03', eol: '2024-11-03' }],
}

describe('ProductSidebar', () => {
  it('製品リストが正しく表示されること', () => {
    render(
      <ProductSidebar
        products={mockProducts}
        selectedProducts={[]}
        toggleProduct={() => {}}
      />,
    )
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Vue')).toBeInTheDocument()
    expect(screen.getByText('Angular')).toBeInTheDocument()
  })

  it('検索入力で製品リストがフィルタリングされること', async () => {
    render(
      <ProductSidebar
        products={mockProducts}
        selectedProducts={[]}
        toggleProduct={() => {}}
      />,
    )

    const searchInput = screen.getByPlaceholderText('Search products...')
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'React' } })
      await new Promise((r) => setTimeout(r, 350)) // debounce
    })

    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.queryByText('Vue')).not.toBeInTheDocument()
    expect(screen.queryByText('Angular')).not.toBeInTheDocument()
  })

  it('チェックボックスをクリックするとtoggleProductが呼ばれること', () => {
    const toggleProductMock = vi.fn()
    render(
      <ProductSidebar
        products={mockProducts}
        selectedProducts={[]}
        toggleProduct={toggleProductMock}
      />,
    )

    fireEvent.click(screen.getByRole('checkbox', { name: 'React' }))
    expect(toggleProductMock).toHaveBeenCalledWith('React')

    fireEvent.click(screen.getByRole('checkbox', { name: 'React-18' }))
    expect(toggleProductMock).toHaveBeenCalledWith('React-18')
  })

  it('選択された製品がリストの上部に表示されること', () => {
    const { rerender } = render(
      <ProductSidebar
        products={mockProducts}
        selectedProducts={['Angular']}
        toggleProduct={() => {}}
      />,
    )

    const productLabels = screen.getAllByText(/^(React|Vue|Angular)$/)
    const productNames = productLabels.map((label) => label.textContent)
    expect(productNames[0]).toBe('Angular')

    rerender(
      <ProductSidebar
        products={mockProducts}
        selectedProducts={['Vue']}
        toggleProduct={() => {}}
      />,
    )

    const newProductLabels = screen.getAllByText(/^(React|Vue|Angular)$/)
    const newProductNames = newProductLabels.map((label) => label.textContent)
    expect(newProductNames[0]).toBe('Vue')
  })

  test('基本的なa11yチェック', async () => {
    const { container } = render(
      <ProductSidebar
        products={mockProducts}
        selectedProducts={[]}
        toggleProduct={() => {}}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  test('製品リストが空の場合のa11yチェック', async () => {
    const { container } = render(
      <ProductSidebar
        products={{}}
        selectedProducts={[]}
        toggleProduct={() => {}}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  test('検索によって製品がフィルタリングされた場合のa11yチェック', async () => {
    const { container } = render(
      <ProductSidebar
        products={mockProducts}
        selectedProducts={[]}
        toggleProduct={() => {}}
      />,
    )
    const searchInput = screen.getByPlaceholderText('Search products...')
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'React' } })
      await new Promise((r) => setTimeout(r, 350)) // debounce
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  test('多数の製品が選択されている場合のa11yチェック', async () => {
    const { container } = render(
      <ProductSidebar
        products={mockProducts}
        selectedProducts={[
          'React',
          'React-18',
          'Vue',
          'Vue-3',
          'Angular',
          'Angular-16',
        ]}
        toggleProduct={() => {}}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  test('長い製品名を持つ製品がある場合のa11yチェック', async () => {
    const longNameProducts = {
      'This is a very long product name to test overflow and accessibility': [
        { cycle: '1.0', releaseDate: '2022-01-01', eol: '2025-01-01' },
      ],
      ...mockProducts,
    }
    const { container } = render(
      <ProductSidebar
        products={longNameProducts}
        selectedProducts={[]}
        toggleProduct={() => {}}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  test('多数の製品がある場合のa11yチェック', async () => {
    const manyProducts = Array.from({ length: 50 }).reduce(
      (acc: ProductDetails, _, i) => {
        const productName = `Product ${i + 1}`
        acc[productName] = Array.from({ length: 3 }, (__, j) => ({
          cycle: `${i + 1}.${j}`,
          releaseDate: '2023-01-01',
          eol: '2026-01-01',
        }))
        return acc
      },
      {} as ProductDetails,
    )
    const { container } = render(
      <ProductSidebar
        products={manyProducts}
        selectedProducts={[]}
        toggleProduct={() => {}}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  test('バージョンを持たない製品がある場合のa11yチェック', async () => {
    const productsWithNoVersions = {
      ...mockProducts,
      'Product With No Versions': [],
    }
    const { container } = render(
      <ProductSidebar
        products={productsWithNoVersions}
        selectedProducts={[]}
        toggleProduct={() => {}}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
