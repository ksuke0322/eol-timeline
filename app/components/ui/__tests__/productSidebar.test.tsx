import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

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

    fireEvent.click(
      screen.getByRole('button', { name: /toggle details for react/i }),
    )
    fireEvent.click(screen.getByRole('checkbox', { name: '18' }))
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
})
