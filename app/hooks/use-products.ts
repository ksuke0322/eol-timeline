import { useEffect, useState } from 'react'

import { type ProductDetails, type ProductVersionDetail } from '~/lib/types'

export const useProducts = () => {
  const [products, setProducts] = useState<ProductDetails>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
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
