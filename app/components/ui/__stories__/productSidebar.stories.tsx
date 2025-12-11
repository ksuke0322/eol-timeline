import { delay, http, HttpResponse } from 'msw'
import { useState } from 'react'
import { within, expect, userEvent, waitFor } from 'storybook/test'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { ProductSidebar } from '~/components/ui/productSidebar'
import { useSelectedProducts } from '~/hooks/useSelectedProducts'
import { type ProductDetails } from '~/lib/types'

const meta = {
  title: 'UI/ProductSidebar',
  component: ProductSidebar,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [
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
        http.get('https://endoflife.date/api/APILoading.json', async () => {
          await delay('infinite')

          return HttpResponse.json([
            { cycle: '17', releaseDate: '2023-11-08', support: '2025-05-08' },
            { cycle: '16', releaseDate: '2023-05-03', support: '2024-11-03' },
          ])
        }),
      ],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProductSidebar>

export default meta
type Story = StoryObj<typeof meta>

const mockProducts: ProductDetails = {
  react: null,
  vue: null,
  angular: null,
}

export const Default: Story = {
  args: {
    products: mockProducts,
    selectedProducts: [],
    toggleProduct: () => {},
    setAllProductDetails: () => {},
  },
  render: (args: Parameters<typeof ProductSidebar>[0]) => {
    localStorage.removeItem('selectedProducts')
    localStorage.removeItem('eol_products_details_cache')

    localStorage.setItem(
      'selectedProducts',
      JSON.stringify(['react', 'react_18', 'react_17', 'vue_3']),
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
      }),
    )

    const [allProductDetails, setAllProductDetails] =
      useState<ProductDetails>(mockProducts)

    const { selectedProducts, toggleProduct } =
      useSelectedProducts(allProductDetails)

    return (
      <div style={{ height: '100vh' }}>
        <ProductSidebar
          {...args}
          products={allProductDetails}
          selectedProducts={selectedProducts}
          toggleProduct={toggleProduct}
          setAllProductDetails={setAllProductDetails}
        />
      </div>
    )
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const reactCheckbox = await canvas.findByRole('checkbox', { name: 'react' })
    const react18Checkbox = await canvas.findByRole('checkbox', {
      name: 'react_18',
    })
    const react17Checkbox = await canvas.findByRole('checkbox', {
      name: 'react_17',
    })

    const vueCheckbox = await canvas.findByRole('checkbox', { name: 'vue' })
    const vue3Checkbox = await canvas.findByRole('checkbox', { name: 'vue_3' })
    const vue2Checkbox = await canvas.findByRole('checkbox', { name: 'vue_2' })

    await waitFor(async () => {
      expect(reactCheckbox).toBeChecked()
      expect(react18Checkbox).toBeChecked()
      expect(react17Checkbox).toBeChecked()
      expect(vueCheckbox).not.toBeChecked()
      expect(vue3Checkbox).toBeChecked()
      expect(vue2Checkbox).not.toBeChecked()
      expect(
        await canvas.queryByRole('checkbox', {
          name: 'angular',
        }),
      ).not.toBeInTheDocument()
      expect(
        await canvas.queryByRole('checkbox', {
          name: 'angular_17',
        }),
      ).not.toBeInTheDocument()
      expect(
        await canvas.queryByRole('checkbox', {
          name: 'angular_16',
        }),
      ).not.toBeInTheDocument()
    })

    // Reactのチェックを外す
    await userEvent.click(reactCheckbox)

    await waitFor(() => {
      expect(reactCheckbox).not.toBeChecked()
      expect(react18Checkbox).not.toBeChecked()
      expect(react17Checkbox).not.toBeChecked()
    })

    // Vueのバージョン2をチェック
    await userEvent.click(vue2Checkbox)

    await waitFor(() => {
      expect(vue2Checkbox).toBeChecked()
      expect(vue3Checkbox).toBeChecked()
      expect(vueCheckbox).toBeChecked()
    })

    // データ取得 & 表示
    await userEvent.click(
      await canvas.findByRole('button', {
        name: 'Toggle details for angular',
      }),
    )

    await waitFor(async () => {
      expect(
        await canvas.queryByRole('checkbox', {
          name: 'angular',
        }),
      ).toBeVisible()
      expect(
        await canvas.queryByRole('checkbox', {
          name: 'angular_17',
        }),
      ).toBeVisible()
      expect(
        await canvas.queryByRole('checkbox', {
          name: 'angular_16',
        }),
      ).toBeVisible()
    })
  },
}

export const Empty: Story = {
  args: {
    products: {},
    selectedProducts: [],
    toggleProduct: () => {},
    setAllProductDetails: () => {},
  },
  render: (args: Parameters<typeof ProductSidebar>[0]) => (
    <div style={{ height: '100vh' }}>
      <ProductSidebar {...args} />
    </div>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('listitem')).not.toBeInTheDocument()
  },
}

export const Searching: Story = {
  args: {
    ...Default.args,
  },
  render: (args: Parameters<typeof ProductSidebar>[0]) => {
    localStorage.setItem(
      'selectedProducts',
      JSON.stringify(['react', 'react_18', 'react_17', 'vue_3']),
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
      }),
    )
    const { selectedProducts, toggleProduct } =
      useSelectedProducts(mockProducts)

    return (
      <div style={{ height: '100vh' }}>
        <ProductSidebar
          {...args}
          selectedProducts={selectedProducts}
          toggleProduct={toggleProduct}
        />
      </div>
    )
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const searchInput = canvas.getByPlaceholderText('Search products...')

    await userEvent.type(searchInput, 'vue', { delay: 500 })
    await waitFor(() => expect(canvas.getByText('vue')).toBeInTheDocument())
    await expect(canvas.queryByText('react')).not.toBeInTheDocument()
    await expect(canvas.queryByText('angular')).not.toBeInTheDocument()
  },
}

export const WithManySelectedProducts: Story = {
  args: {
    ...Default.args,
    products: {
      ...mockProducts,
      anotherTool: [],
      superTool: [],
    },
  },
  render: (args: Parameters<typeof ProductSidebar>[0]) => {
    localStorage.setItem(
      'selectedProducts',
      JSON.stringify(['react_18', 'vue', 'angular_17', 'anotherTool_1.0']),
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
            { cycle: '17', releaseDate: '2020-09-18', support: '2024-03-18' },
          ],
          timestamp: Date.now(),
        },
        anotherTool: {
          data: [
            { cycle: '1.0', releaseDate: '2020-09-18', support: '2024-03-18' },
          ],
          timestamp: Date.now(),
        },
      }),
    )

    const [allProductDetails, setAllProductDetails] =
      useState<ProductDetails>(mockProducts)

    const { selectedProducts, toggleProduct } =
      useSelectedProducts(allProductDetails)

    return (
      <div style={{ height: '100vh' }}>
        <ProductSidebar
          {...args}
          products={allProductDetails}
          selectedProducts={selectedProducts}
          toggleProduct={toggleProduct}
          setAllProductDetails={setAllProductDetails}
        />
      </div>
    )
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() =>
      expect(canvas.getByRole('checkbox', { name: 'react_18' })).toBeChecked(),
    )
    await waitFor(() =>
      expect(canvas.getByRole('checkbox', { name: 'vue' })).toBeChecked(),
    )
    await waitFor(() =>
      expect(
        canvas.getByRole('checkbox', { name: 'angular_17' }),
      ).toBeChecked(),
    )
    await waitFor(() =>
      expect(
        canvas.getByRole('checkbox', { name: 'anotherTool_1.0' }),
      ).toBeChecked(),
    )
  },
}

export const WithLongProductNames: Story = {
  args: {
    products: {
      'This is a very long product name to test overflow': [],
      ...mockProducts,
    },
    selectedProducts: [],
    toggleProduct: (id: string) => {
      console.log(`Toggling product: ${id}`)
    },
    setAllProductDetails: () => {},
  },
  render: (args: Parameters<typeof ProductSidebar>[0]) => (
    <div style={{ height: '100vh' }}>
      <ProductSidebar {...args} />
    </div>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const longNameProduct = canvas.getByText(
      'This is a very long product name to test overflow',
    )
    await expect(longNameProduct).toBeInTheDocument()
    // 必要に応じて、テキストが切り捨てられていないか、または適切に折り返されているかを確認するアサーションを追加
  },
}

const manyProducts: ProductDetails = Array.from({ length: 100 }).reduce(
  (acc: ProductDetails, _, i) => {
    const productName = `Product ${i + 1}`
    acc[productName] = Array.from({ length: 5 }, (__, j) => ({
      cycle: `${i + 1}.${j}`,
      releaseDate: '2023-01-01',
      support: '2026-01-01',
    }))
    return acc
  },
  {} as ProductDetails,
)

export const WithManyProducts: Story = {
  args: {
    ...Default.args,
    products: manyProducts,
  },
  render: (args: Parameters<typeof ProductSidebar>[0]) => {
    localStorage.setItem(
      'selectedProducts',
      JSON.stringify(['Product 1_1.0', 'Product 50_50.2']),
    )

    localStorage.setItem(
      'eol_products_details_cache',
      JSON.stringify({
        'Product 1': {
          data: [
            { cycle: '1.0', releaseDate: '2022-03-29', support: '2025-03-29' },
          ],
          timestamp: Date.now(),
        },
        'Product 50': {
          data: [
            { cycle: '50.2', releaseDate: '2020-09-18', support: '2024-03-18' },
          ],
          timestamp: Date.now(),
        },
      }),
    )

    const [allProductDetails, setAllProductDetails] =
      useState<ProductDetails>(mockProducts)

    const { selectedProducts, toggleProduct } =
      useSelectedProducts(allProductDetails)

    return (
      <div style={{ height: '100vh' }}>
        <ProductSidebar
          {...args}
          selectedProducts={selectedProducts}
          toggleProduct={toggleProduct}
          setAllProductDetails={setAllProductDetails}
        />
      </div>
    )
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const product50Checkbox = await canvas.findByRole('checkbox', {
      name: 'Product 1_1.0',
    })
    const product50_2Checkbox = await canvas.findByRole('checkbox', {
      name: 'Product 50_50.2',
    })
    await waitFor(() => expect(product50Checkbox).toBeChecked())
    await waitFor(() => expect(product50_2Checkbox).toBeChecked())
  },
}

export const APIError: Story = {
  args: {
    ...Default.args,
    products: {
      ...mockProducts,
      APIError: [],
    },
    selectedProducts: [],
  },
  render: (args: Parameters<typeof ProductSidebar>[0]) => (
    <div style={{ height: '100vh' }}>
      <ProductSidebar {...args} />
    </div>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const productAPIError = canvas.getByText('APIError')
    await expect(productAPIError).toBeInTheDocument()

    const productAPIErrorToggle = canvas.getByRole('button', {
      name: 'Toggle details for APIError',
    })

    await Promise.all([
      waitFor(() => expect(canvas.getByText('API Error')).toBeInTheDocument()),
      userEvent.click(productAPIErrorToggle),
    ])
  },
}

export const APILoading: Story = {
  args: {
    ...Default.args,
    products: {
      ...mockProducts,
      APILoading: null,
    },
    selectedProducts: [],
  },
  render: (args: Parameters<typeof ProductSidebar>[0]) => (
    <div style={{ height: '100vh' }}>
      <ProductSidebar {...args} />
    </div>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const productAPILoading = canvas.getByText('APILoading')
    await expect(productAPILoading).toBeInTheDocument()

    const productAPILoadingToggle = canvas.getByRole('button', {
      name: 'Toggle details for APILoading',
    })

    await Promise.all([
      waitFor(() =>
        expect(
          canvas.getByTestId('productSidebarSkeleton'),
        ).toBeInTheDocument(),
      ),
      userEvent.click(productAPILoadingToggle),
    ])
  },
}
