import type { Meta, StoryObj } from '@storybook/react-vite'

import { ProductSidebar } from '~/components/ui/productSidebar'
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
  React: [
    { cycle: '18', releaseDate: '2022-03-29', eol: '2025-03-29' },
    { cycle: '17', releaseDate: '2020-10-20', eol: '2023-10-20' },
  ],
  Vue: [
    { cycle: '3', releaseDate: '2020-09-18', eol: '2024-03-18' },
    { cycle: '2', releaseDate: '2016-09-30', eol: '2023-12-31' },
  ],
  Angular: [
    { cycle: '17', releaseDate: '2023-11-08', eol: '2025-05-08' },
    { cycle: '16', releaseDate: '2023-05-03', eol: '2024-11-03' },
  ],
}

export const Default: Story = {
  args: {
    products: mockProducts,
    selectedProducts: ['React-18', 'Vue'],
    toggleProduct: (id: string) => {
      console.log(`Toggling product: ${id}`)
    },
  },
  render: (args) => (
    <div style={{ height: '100vh' }}>
      <ProductSidebar {...args} />
    </div>
  ),
}

export const Empty: Story = {
  args: {
    products: {},
    selectedProducts: [],
    toggleProduct: () => {},
  },
  render: (args) => (
    <div style={{ height: '100vh' }}>
      <ProductSidebar {...args} />
    </div>
  ),
}
