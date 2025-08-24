import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { GanttTask, ProductDetails } from './types'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

const COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Light Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint Green
  '#F7DC6F', // Yellow
  '#BB8FCE', // Light Purple
  '#F0B27A', // Orange
  '#82E0AA', // Light Green
  '#D7BDE2', // Lavender
]

const productColors = new Map<string, string>()
let colorIndex = 0

const getProductColor = (productName: string): string => {
  if (!productColors.has(productName)) {
    productColors.set(productName, COLORS[colorIndex % COLORS.length])
    colorIndex++
  }
  return productColors.get(productName) || '#CCCCCC' // Default grey if somehow not found
}

export const convertProductVersionDetailsToGanttTasks = (
  allProductDetails: ProductDetails,
  selectedProductsSet: Set<string>,
): GanttTask[] => {
  const tasks: GanttTask[] = []

  for (const productName in allProductDetails) {
    const versions = allProductDetails[productName] ?? []
    const color = getProductColor(productName)
    if (selectedProductsSet.has(productName)) {
      versions.forEach((detail) => {
        const endDate =
          typeof detail.support === 'string'
            ? detail.support
            : typeof detail.eol === 'string'
              ? detail.eol
              : detail.releaseDate

        const eol_status = (() => {
          if (
            typeof detail.support === 'string' ||
            typeof detail.eol === 'string'
          ) {
            return 0
          }

          // こんなことあるのか？？
          if (!('support' in detail) && !('eol' in detail)) {
            return 2
          }

          // サポート中 || EOL でない = support:true, eol:false
          if (
            detail.support ||
            (!detail.eol && typeof detail.eol !== 'undefined')
          ) {
            return 1
          }

          return 2
        })()

        const taskName = `${productName} ${detail.cycle}${eol_status === 0 ? '' : eol_status === 1 ? ' |----------> Support' : ' | EOL'}`

        tasks.push({
          id: detail.cycle,
          name: taskName,
          productName: productName,
          start: detail.releaseDate,
          end: endDate,
          progress: 0,
          color: color,
          eol_status,
        })
      })
    } else {
      for (const version of versions) {
        if (selectedProductsSet.has(`${productName}_${version.cycle}`)) {
          const endDate =
            typeof version.support === 'string'
              ? version.support
              : typeof version.eol === 'string'
                ? version.eol
                : version.releaseDate

          const eol_status = (() => {
            if (
              typeof version.support === 'string' ||
              typeof version.eol === 'string'
            ) {
              return 0
            }

            // こんなことあるのか？？
            if (!('support' in version) && !('eol' in version)) {
              return 2
            }

            // サポート中 || EOL でない = support:true, eol:false
            if (
              version.support ||
              (!version.eol && typeof version.eol !== 'undefined')
            ) {
              return 1
            }

            return 2
          })()

          const taskName = `${productName} ${version.cycle}${eol_status === 0 ? '' : eol_status === 1 ? ' |----------> Support' : ' | EOL'}`

          tasks.push({
            id: version.cycle,
            name: taskName,
            productName: productName,
            start: version.releaseDate,
            end: endDate,
            progress: 0,
            color: color,
            eol_status,
          })
        }
      }
    }
  }
  return tasks
}
