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

  console.log(selectedProducts)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedProducts))
    } catch (error) {
      console.error(error)
    }
  }, [selectedProducts])

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) => {
      const newSelection = new Set(prev)
      const isProduct = !!allProducts[id]

      if (isProduct) {
        // --- 製品（親）がクリックされた場合 ---
        const productName = id
        const versions = allProducts[productName] || []
        const versionIds = versions.map((v) => `${productName}-${v.cycle}`)

        if (newSelection.has(productName)) {
          // 製品の選択を解除
          newSelection.delete(productName)
          versionIds.forEach((vid) => newSelection.delete(vid))
        } else {
          // 製品を選択
          newSelection.add(productName)
          versionIds.forEach((vid) => newSelection.add(vid))
        }
      } else {
        // --- バージョン（子）がクリックされた場合 ---
        const versionId = id
        const productName = Object.keys(allProducts).find((p) =>
          versionId.startsWith(`${p}-`),
        )

        if (!productName) return Array.from(newSelection) // 親製品が見つからない場合は何もしない

        if (newSelection.has(versionId)) {
          // バージョンの選択を解除
          newSelection.delete(versionId)
          // 親製品の選択も解除
          newSelection.delete(productName)
        } else {
          // バージョンを選択
          newSelection.add(versionId)

          // この製品のすべてのバージョンが選択されたか確認
          const versions = allProducts[productName] || []
          const allVersionsSelected = versions.every((v) =>
            newSelection.has(`${productName}-${v.cycle}`),
          )

          if (allVersionsSelected) {
            // すべて選択されていれば親製品も選択
            newSelection.add(productName)
          }
        }
      }

      const newSelectionArray = Array.from(newSelection)
      // 変更がない場合は既存の prev を返す
      if (
        newSelectionArray.length === prev.length &&
        newSelectionArray.every((item) => prev.includes(item))
      ) {
        return prev
      }

      return newSelectionArray
    })
  }

  return {
    selectedProducts,
    toggleProduct,
  }
}
