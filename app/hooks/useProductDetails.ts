import { useEffect, useState } from 'react'

import type { ProductSidebarProps } from '~/components/ui/productSidebar'
import type { ProductVersionDetail } from '~/lib/types'

type ProductDetailCache = {
  [key: string]: {
    data: ProductVersionDetail[]
    timestamp: number
  }
}

const CACHE_KEY = 'eol_products_details_cache'
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000 * 7 // 1週間

export const useProductDetails = ({
  products,
  selectedProducts,
  toggleProduct,
  setAllProductDetails,
}: ProductSidebarProps) => {
  // 基本的には products だけで処理のすべてを賄えるが、productDetails のキャッシュの更新のために値を保持している
  const [productDetails, setProductDetails] = useState<ProductDetailCache>({})

  const updateObsoleteProductDetails = async (productName: string) => {
    const response = await fetch(
      `https://endoflife.date/api/${productName}.json`,
    )

    if (!response.ok) {
      throw new Error(
        `Failed to fetch product details : ${response.statusText}`,
      )
    }

    return await response.json()
  }

  useEffect(() => {
    const init = async () => {
      const cacheData = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')

      if (Object.keys(cacheData).length === 0) return

      const newAllProducts = { ...products }
      const newProductDetails = { ...cacheData }

      for (const name of Object.keys(newProductDetails)) {
        newAllProducts[name] = newProductDetails[name].data
      }

      const selectedProductNames = Array.from(
        new Set(selectedProducts.map((p) => p.split('_')[0])),
      )

      for (const productName of Object.keys(newProductDetails)) {
        const isSelected = selectedProductNames.includes(productName)
        const isObsolete =
          Date.now() - newProductDetails[productName].timestamp >= CACHE_MAX_AGE

        if (productName in newAllProducts && isSelected && isObsolete) {
          updateObsoleteProductDetails(productName)
            .then((productDetailsResponse: ProductVersionDetail[]) => {
              newAllProducts[productName] = productDetailsResponse
              newProductDetails[productName] = {
                data: productDetailsResponse,
                timestamp: Date.now(),
              }

              const productCycles = productDetailsResponse.map(
                (detail) => detail.cycle,
              )

              selectedProducts.forEach((p) => {
                if (!productCycles.includes(p)) {
                  toggleProduct(p)
                }
              })
            })
            .catch((e) => {
              console.error(e.message)
            })
        }
      }

      setAllProductDetails(newAllProducts)
      setProductDetails(newProductDetails)
      localStorage.setItem(CACHE_KEY, JSON.stringify(newProductDetails))
    }

    init()
  }, [])

  const updateProductDetails = async (productName: string) => {
    // 通信済み & 失敗していた場合は同セッション中は再通信を避ける
    if (
      Array.isArray(products[productName]) &&
      products[productName].length === 0
    ) {
      console.log(productName, products[productName])
      return
    }

    if (
      products[productName] === null ||
      (productDetails[productName] &&
        Date.now() - productDetails[productName].timestamp >= CACHE_MAX_AGE)
    ) {
      updateObsoleteProductDetails(productName)
        .then((productDetailsResponse) => {
          setAllProductDetails({
            ...products,
            [productName]: productDetailsResponse,
          })

          const newData = {
            ...productDetails,
            [productName]: {
              data: productDetailsResponse,
              timestamp: Date.now(),
            },
          }

          setProductDetails(newData)

          localStorage.setItem(CACHE_KEY, JSON.stringify(newData))
        })
        .catch((e) => {
          if (products[productName] === null) {
            // 次回訪問時再通信させるため、localStorage は更新しない
            // APIからの取得に失敗した場合、エラー表示と再取得防止のため空データで state を更新する
            setAllProductDetails((prev) => ({
              ...prev,
              [productName]: [],
            }))
          }

          console.error(e.message)
        })
    }
  }

  return {
    productDetails,
    updateProductDetails,
  }
}
