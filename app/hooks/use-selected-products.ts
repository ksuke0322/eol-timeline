import { useState, useEffect } from 'react'

import { type ProductDetails } from '~/lib/types'

const STORAGE_KEY = 'selectedProducts'

export const useSelectedProducts = (allProducts: ProductDetails) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY)
      return item ? JSON.parse(item) : []
    } catch (error) {
      console.error(error)
      return []
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedProducts))
    } catch (error) {
      console.error(error)
    }
  }, [selectedProducts])

  const toggleProduct = (productName: string) => {
    setSelectedProducts((prev) => {
      const isProductSelected = prev.includes(productName)
      let newSelection = [...prev]

      if (isProductSelected) {
        // 製品の選択を解除する場合、その製品の全てのバージョンも解除
        newSelection = newSelection.filter((p) => p !== productName)
        if (allProducts[productName]) {
          allProducts[productName].forEach((version) => {
            const versionId = `${productName}-${version.cycle}`
            newSelection = newSelection.filter((p) => p !== versionId)
          })
        }
      } else {
        // 製品を選択する場合、その製品の全てのバージョンも選択
        newSelection = [...newSelection, productName]
        if (allProducts[productName]) {
          allProducts[productName].forEach((version) => {
            const versionId = `${productName}-${version.cycle}`
            if (!newSelection.includes(versionId)) {
              newSelection = [...newSelection, versionId]
            }
          })
        }
      }
      return newSelection
    })
  }

  const selectAll = (productNames: string[]) => {
    setSelectedProducts((prev) => {
      let newSelection = [...prev]
      productNames.forEach((productName) => {
        if (!newSelection.includes(productName)) {
          newSelection = [...newSelection, productName]
        }
        if (allProducts[productName]) {
          allProducts[productName].forEach((version) => {
            const versionId = `${productName}-${version.cycle}`
            if (!newSelection.includes(versionId)) {
              newSelection = [...newSelection, versionId]
            }
          })
        }
      })
      return newSelection
    })
  }

  const deselectAll = () => {
    setSelectedProducts([])
  }

  return {
    selectedProducts,
    toggleProduct,
    selectAll,
    deselectAll,
  }
}
