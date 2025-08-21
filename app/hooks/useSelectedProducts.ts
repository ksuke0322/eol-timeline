import { useState, useEffect, useMemo } from 'react'

import { type ProductDetails } from '~/lib/types'

const STORAGE_KEY = 'selectedProducts'

export const useSelectedProducts = (
  allProducts: ProductDetails,
  customProducts: ProductDetails = {},
) => {
  const combinedProducts = useMemo(
    () => ({ ...allProducts, ...customProducts }),
    [allProducts, customProducts],
  )

  const [selectedProducts, setSelectedProducts] = useState<string[]>(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY)
      return item ? JSON.parse(item) : []
    } catch (error) {
      console.error(
        'Failed to parse selected products from localStorage',
        error,
      )
      return []
    }
  })

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        setSelectedProducts(JSON.parse(event.newValue))
      }
    }

    window.addEventListener('storage', handleStorageChange)

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedProducts))
    } catch (error) {
      console.error('Failed to save selected products to localStorage', error)
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [selectedProducts])

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) => {
      const newSelection = new Set(prev)
      const isProduct = !!combinedProducts[id]

      if (isProduct) {
        const productName = id
        const versions = combinedProducts[productName] || []
        // FIXME: 2025/08 現在、プロダクト名に _ を含むものはないため採用
        // いつか変える日がくるかも
        const versionIds = versions.map((v) => `${productName}_${v.cycle}`)

        if (newSelection.has(productName)) {
          newSelection.delete(productName)
          versionIds.forEach((vid) => newSelection.delete(vid))
        } else {
          newSelection.add(productName)
          versionIds.forEach((vid) => newSelection.add(vid))
        }
      } else {
        const versionId = id
        const productName = Object.keys(combinedProducts).find((p) =>
          versionId.startsWith(`${p}_`),
        )

        if (!productName) return Array.from(newSelection)

        if (newSelection.has(versionId)) {
          newSelection.delete(versionId)
          newSelection.delete(productName)
        } else {
          newSelection.add(versionId)

          const versions = combinedProducts[productName] || []
          const allVersionsSelected = versions.every((v) =>
            newSelection.has(`${productName}_${v.cycle}`),
          )

          if (allVersionsSelected) {
            newSelection.add(productName)
          }
        }
      }

      const newSelectionArray = Array.from(newSelection)
      if (
        newSelectionArray.length === prev.length &&
        newSelectionArray.every((item) => prev.includes(item))
      ) {
        return prev
      }

      return newSelectionArray
    })
  }

  const selectAllProducts = () => {
    const allIds = new Set<string>()
    Object.entries(combinedProducts).forEach(([productName, versions]) => {
      allIds.add(productName)
      versions?.forEach((v) => allIds.add(`${productName}_${v.cycle}`))
    })
    setSelectedProducts(Array.from(allIds))
  }

  const clearAllProducts = () => {
    setSelectedProducts([])
  }

  return {
    selectedProducts,
    toggleProduct,
    selectAllProducts,
    clearAllProducts,
  }
}
