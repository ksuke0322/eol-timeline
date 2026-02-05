import { useMemo, useState } from 'react'
import { useLoaderData } from 'react-router'

import type { ProductDetails } from '~/lib/types'

import GanttChart from '~/components/ui/ganttChart'
import { ProductSidebar } from '~/components/ui/productSidebar'
import { useSelectedProducts } from '~/hooks/useSelectedProducts'
import { convertProductVersionDetailsToGanttTasks } from '~/lib/utils'

export const meta = () => {
  return [
    { title: 'EOL Timeline' },
    {
      name: 'description',
      content: 'display eol timeline which is based on endoflife.date',
    },
  ]
}

const CACHE_KEY = 'eol_products_list_cache'
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000 // 1 day in milliseconds

export const clientLoader = async (): Promise<ProductDetails> => {
  try {
    // キャッシュからの読み込みを試みる
    const cachedData = (() => {
      const cachedData = localStorage.getItem(CACHE_KEY)
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData)
        if (Date.now() - timestamp < ONE_DAY_IN_MS) {
          return data
        }
      }
      return null
    })()

    let productNames: string[]
    if (cachedData) {
      productNames = cachedData
    } else {
      // キャッシュが無効または存在しない場合はAPIからフェッチ
      const response = await fetch('https://endoflife.date/api/all.json')

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      productNames = await response.json()

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data: productNames, timestamp: Date.now() }),
      )
    }

    const productDetails: ProductDetails = {}
    productNames.forEach((productName) => {
      productDetails[productName] = null
    })

    return productDetails
  } catch (e) {
    console.error('Error in clientLoader:', e)
    // エラーハンドリングを強化するか、適切なデフォルト値を返す
    throw e // エラーを再スローしてErrorBoundaryで捕捉させる
  }
}

const Home = () => {
  const _allProductDetails = useLoaderData<ProductDetails>()
  const [allProductDetails, setAllProductDetails] =
    useState<ProductDetails>(_allProductDetails)
  const { selectedProducts, toggleProduct } =
    useSelectedProducts(allProductDetails)
  const selectedProductsSet = useMemo(
    () => new Set(selectedProducts),
    [selectedProducts],
  )
  const [sortOrder, setSortOrder] = useState<'tool' | 'release' | 'eol'>('tool')

  const ganttTasks = useMemo(() => {
    const tasks = convertProductVersionDetailsToGanttTasks(
      allProductDetails,
      selectedProductsSet,
    )

    switch (sortOrder) {
      case 'release':
        return [...tasks].sort(
          (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
        )
      case 'eol':
        return [...tasks].sort(
          (a, b) => new Date(a.end).getTime() - new Date(b.end).getTime(),
        )
      case 'tool':
      default:
        return [...tasks].sort((a, b) => a.name.localeCompare(b.name))
    }
  }, [allProductDetails, selectedProductsSet, sortOrder])

  return (
    <div className="flex">
      <ProductSidebar
        products={allProductDetails}
        selectedProducts={selectedProducts}
        toggleProduct={toggleProduct}
        setAllProductDetails={setAllProductDetails}
      />
      <main className="flex-1 justify-stretch p-4">
        <div className="mb-4">
          <label htmlFor="sort-order" className="mr-2">
            Sort by:
          </label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as 'tool' | 'release' | 'eol')
            }
            className="rounded-sm border p-1"
          >
            <option value="tool">tool</option>
            <option value="release">release date</option>
            <option value="eol">eol date</option>
          </select>
        </div>
        <div className="min-w-0 overflow-x-auto">
          <GanttChart
            tasks={ganttTasks}
            aria-label="製品のサポート終了タイムラインチャート"
          />
        </div>
      </main>
    </div>
  )
}

export default Home
