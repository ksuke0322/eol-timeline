import { within, expect, userEvent, waitFor } from '@storybook/test'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { ProductSidebar } from '~/components/ui/productSidebar'
import { useSelectedProducts } from '~/hooks/useSelectedProducts'
import { type ProductDetails } from '~/lib/types'

const meta = {
  title: 'UI/ProductSidebar',
  component: ProductSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProductSidebar>

export default meta
type Story = StoryObj<typeof meta>

const mockProducts: ProductDetails = {
  react: [
    { cycle: '18', releaseDate: '2022-03-29', eol: '2025-03-29' },
    { cycle: '17', releaseDate: '2020-10-20', eol: '2023-10-20' },
  ],
  vue: [
    { cycle: '3', releaseDate: '2020-09-18', eol: '2024-03-18' },
    { cycle: '2', releaseDate: '2016-09-30', eol: '2023-12-31' },
  ],
  angular: [
    { cycle: '17', releaseDate: '2023-11-08', eol: '2025-05-08' },
    { cycle: '16', releaseDate: '2023-05-03', eol: '2024-11-03' },
  ],
}

export const Default: Story = {
  args: {
    products: mockProducts,
    selectedProducts: [],
    toggleProduct: () => {},
  },
  render: (args: Parameters<typeof ProductSidebar>[0]) => {
    localStorage.setItem(
      'selectedProducts',
      JSON.stringify(['react', 'react-18', 'react-17', 'vue-3']),
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
    const reactCheckbox = await canvas.findByRole('checkbox', { name: 'react' })
    const react18Checkbox = await canvas.findByRole('checkbox', {
      name: 'react-18',
    })
    const react17Checkbox = await canvas.findByRole('checkbox', {
      name: 'react-17',
    })
    const vueCheckbox = await canvas.findByRole('checkbox', { name: 'vue' })
    const vue3Checkbox = await canvas.findByRole('checkbox', { name: 'vue-3' })
    const vue2Checkbox = await canvas.findByRole('checkbox', { name: 'vue-2' })

    await waitFor(() => expect(reactCheckbox).toBeChecked())
    await waitFor(() => expect(react18Checkbox).toBeChecked())
    await waitFor(() => expect(react17Checkbox).toBeChecked())

    await waitFor(() => expect(vueCheckbox).not.toBeChecked())
    await waitFor(() => expect(vue3Checkbox).toBeChecked())
    await waitFor(() => expect(vue2Checkbox).not.toBeChecked())

    // Reactのチェックを外す
    await userEvent.click(reactCheckbox)
    await waitFor(() => expect(reactCheckbox).not.toBeChecked())
    await waitFor(() => expect(react18Checkbox).not.toBeChecked())
    await waitFor(() => expect(react17Checkbox).not.toBeChecked())

    // Vueのバージョン2をチェック
    await userEvent.click(vue2Checkbox)
    await waitFor(() => expect(vue2Checkbox).toBeChecked())
    await waitFor(() => expect(vue3Checkbox).toBeChecked())
    await waitFor(() => expect(vueCheckbox).toBeChecked())
  },
}

export const Empty: Story = {
  args: {
    products: {},
    selectedProducts: [],
    toggleProduct: () => {},
  },
  render: (args: Parameters<typeof ProductSidebar>[0]) => (
    <div style={{ height: '100vh' }}>
      <ProductSidebar {...args} />
    </div>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('checkbox')).not.toBeInTheDocument()
    await expect(canvas.queryByText('react')).not.toBeInTheDocument()
  },
}

export const Searching: Story = {
  args: {
    ...Default.args,
  },
  render: (args: Parameters<typeof ProductSidebar>[0]) => {
    localStorage.setItem(
      'selectedProducts',
      JSON.stringify(['react', 'react-18', 'react-17', 'vue-3']),
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
      another_tool: [
        { cycle: '1.0', releaseDate: '2022-01-01', eol: '2025-01-01' },
      ],
      super_tool: [
        { cycle: '2.0', releaseDate: '2023-01-01', eol: '2026-01-01' },
      ],
    },
  },
  render: (args: Parameters<typeof ProductSidebar>[0]) => {
    localStorage.setItem(
      'selectedProducts',
      JSON.stringify(['react-18', 'vue', 'angular-17', 'another_tool-1.0']),
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
    await waitFor(() =>
      expect(canvas.getByRole('checkbox', { name: 'react-18' })).toBeChecked(),
    )
    await waitFor(() =>
      expect(canvas.getByRole('checkbox', { name: 'vue' })).toBeChecked(),
    )
    await waitFor(() =>
      expect(
        canvas.getByRole('checkbox', { name: 'angular-17' }),
      ).toBeChecked(),
    )
    await waitFor(() =>
      expect(
        canvas.getByRole('checkbox', { name: 'another_tool-1.0' }),
      ).toBeChecked(),
    )
  },
}

export const WithLongProductNames: Story = {
  args: {
    products: {
      'This is a very long product name to test overflow': [
        { cycle: '1.0', releaseDate: '2022-01-01', eol: '2025-01-01' },
      ],
      ...mockProducts,
    },
    selectedProducts: ['react-18'],
    toggleProduct: (id: string) => {
      console.log(`Toggling product: ${id}`)
    },
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
      eol: '2026-01-01',
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
      JSON.stringify(['Product 1-1.0', 'Product 50-50.2']),
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
    const product50Checkbox = await canvas.findByRole('checkbox', {
      name: 'Product 1-1.0',
    })
    const product50_2Checkbox = await canvas.findByRole('checkbox', {
      name: 'Product 50-50.2',
    })
    await waitFor(() => expect(product50Checkbox).toBeChecked())
    await waitFor(() => expect(product50_2Checkbox).toBeChecked())
  },
}

export const WithNoVersions: Story = {
  args: {
    ...Default.args,
    products: {
      ...mockProducts,
      'Product With No Versions': [],
    },
    selectedProducts: ['react-18'],
  },
  render: (args: Parameters<typeof ProductSidebar>[0]) => (
    <div style={{ height: '100vh' }}>
      <ProductSidebar {...args} />
    </div>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const productNoVersions = canvas.getByText('Product With No Versions')
    await expect(productNoVersions).toBeInTheDocument()

    const productNoVersionsToggle = canvas.getByRole('button', {
      name: 'Toggle details for Product With No Versions',
    })

    await Promise.all([
      waitFor(() => expect(canvas.getByText('No version')).toBeInTheDocument()),
      userEvent.click(productNoVersionsToggle),
    ])
  },
}
