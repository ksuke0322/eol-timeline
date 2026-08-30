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

  const updateObsoleteProductDetails = async (
    productName: string,
  ): Promise<ProductVersionDetail[]> => {
    const response = await fetch(
      `https://endoflife.date/api/${productName}.json`,
    )

    if (!response.ok) {
      throw new Error(
        `Failed to fetch product details : ${response.statusText}`,
      )
    }

    return (await response.json()) as ProductVersionDetail[]
  }

  useEffect(() => {
    const init = async () => {
      const cacheData = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')

      if (Object.keys(cacheData).length === 0) return

      const cachedProducts = { ...products }
      const cachedProductDetails = { ...cacheData }

      for (const name of Object.keys(cachedProductDetails)) {
        cachedProducts[name] = cachedProductDetails[name].data
      }

      // stale-while-revalidate: まず既存キャッシュを表示し、再取得完了後に
      // 新しいオブジェクトで state と localStorage を更新する。
      setAllProductDetails(cachedProducts)
      setProductDetails(cachedProductDetails)
      localStorage.setItem(CACHE_KEY, JSON.stringify(cachedProductDetails))

      const selectedProductNames = Array.from(
        new Set(selectedProducts.map((p) => p.split('_')[0])),
      )

      const obsoleteProductNames = Object.keys(cachedProductDetails).filter(
        (productName) => {
          const isSelected = selectedProductNames.includes(productName)
          const isObsolete =
            Date.now() - cachedProductDetails[productName].timestamp >=
            CACHE_MAX_AGE

          return productName in products && isSelected && isObsolete
        },
      )

      const refreshResults = await Promise.allSettled(
        obsoleteProductNames.map(async (productName) => ({
          productName,
          data: await updateObsoleteProductDetails(productName),
        })),
      )

      const refreshedProducts = { ...cachedProducts }
      const refreshedProductDetails = { ...cachedProductDetails }
      let hasSuccessfulRefresh = false

      for (const result of refreshResults) {
        if (result.status === 'rejected') {
          const message =
            result.reason instanceof Error
              ? result.reason.message
              : String(result.reason)
          console.error(message)
          continue
        }

        const { productName, data: productDetailsResponse } = result.value
        hasSuccessfulRefresh = true
        refreshedProducts[productName] = productDetailsResponse
        refreshedProductDetails[productName] = {
          data: productDetailsResponse,
          timestamp: Date.now(),
        }

        const availableVersionIds = new Set(
          productDetailsResponse.map(
            (detail) => `${productName}_${detail.cycle}`,
          ),
        )

        selectedProducts
          .filter(
            (id) => id === productName || id.startsWith(`${productName}_`),
          )
          .forEach((id) => {
            if (id !== productName && !availableVersionIds.has(id)) {
              toggleProduct(id)
            }
          })
      }

      if (!hasSuccessfulRefresh) return

      setAllProductDetails(refreshedProducts)
      setProductDetails(refreshedProductDetails)
      localStorage.setItem(CACHE_KEY, JSON.stringify(refreshedProductDetails))
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
