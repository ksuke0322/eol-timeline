import { useEffect, useState } from 'react'

import { type ProductDetails, type ProductVersionDetail } from '~/lib/types'

const CACHE_KEY = 'eol_products_cache'
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000 // 1 day in milliseconds

export const useProducts = () => {
  const [products, setProducts] = useState<ProductDetails>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 1. キャッシュからの読み込みを試みる
        const cachedData = localStorage.getItem(CACHE_KEY)
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData)
          if (Date.now() - timestamp < ONE_DAY_IN_MS) {
            setProducts(data)
            setLoading(false)
            return // キャッシュされたデータを使用
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
        setProducts(productDetails)

        // 3. キャッシュに保存
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: productDetails, timestamp: Date.now() }),
        )
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, loading, error }
}
