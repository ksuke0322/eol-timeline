import { useMemo, useState } from 'react'
import { useLoaderData } from 'react-router'

import type { ProductVersionDetail, ProductDetails } from '~/lib/types'

import GanttChart from '~/components/ui/ganttChart'
import { ProductSidebar } from '~/components/ui/productSidebar'
import { useSelectedProducts } from '~/hooks/useSelectedProducts'
import { convertProductVersionDetailsToGanttTasks } from '~/lib/utils'

export function meta() {
  return [
    { title: 'EOL Timeline' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}

const CACHE_KEY = 'eol_products_cache'
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000 // 1 day in milliseconds

export const clientLoader = async (): Promise<ProductDetails> => {
  try {
    // 1. キャッシュからの読み込みを試みる
    const cachedData = localStorage.getItem(CACHE_KEY)
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData)
      if (Date.now() - timestamp < ONE_DAY_IN_MS) {
        return data // キャッシュされたデータを使用
      }
    }

    // 2. キャッシュが無効または存在しない場合はAPIからフェッチ
    const response = await fetch('https://endoflife.date/api/all.json')
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }
    const productNames: string[] = await response.json()

    const fetchDetailPromises = productNames.map(async (productName) => {
      try {
        const detailResponse = await fetch(
          `https://endoflife.date/api/${productName}.json`,
        )
        if (!detailResponse.ok) {
          console.warn(`Failed to fetch details for ${productName}`)
          return null // 失敗した場合はnullを返す
        }
        const details: ProductVersionDetail[] = await detailResponse.json()
        return { productName, details }
      } catch (e) {
        console.warn(`Error fetching details for ${productName}:`, e)
        return null // エラーが発生した場合もnullを返す
      }
    })

    const results = await Promise.all(fetchDetailPromises)

    const productDetails: ProductDetails = {}
    results.forEach((result) => {
      if (result) {
        productDetails[result.productName] = result.details
      }
    })

    // 3. キャッシュに保存
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data: productDetails, timestamp: Date.now() }),
    )

    return productDetails
  } catch (e) {
    console.error('Error in clientLoader:', e)
    // エラーハンドリングを強化するか、適切なデフォルト値を返す
    throw e // エラーを再スローしてErrorBoundaryで捕捉させる
  }
}

const Home = () => {
  const allProductDetails = useLoaderData<ProductDetails>()
  console.log('allProductDetails:', allProductDetails)
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
            className="rounded border p-1"
          >
            <option value="tool">ツール順</option>
            <option value="release">リリース日</option>
            <option value="eol">EOL日</option>
          </select>
        </div>
        {/* 画面幅 - sidemenu幅 - メイン領域左右padding */}
        <div className="w-[calc(100svw-16rem-32px)] overflow-hidden">
          <GanttChart tasks={ganttTasks} />
        </div>
      </main>
    </div>
  )
}

export default Home
