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
    const versions = allProductDetails[productName]
    const color = getProductColor(productName)
    if (selectedProductsSet.has(productName)) {
      versions.forEach((detail) => {
        const taskName = `${productName} ${detail.cycle}`
        const endDate =
          typeof detail.eol === 'string'
            ? detail.eol
            : detail.eol === false
              ? new Date(
                  new Date(detail.releaseDate).setFullYear(
                    new Date(detail.releaseDate).getFullYear() + 1,
                  ),
                )
                  .toISOString()
                  .split('T')[0]
              : detail.releaseDate
        tasks.push({
          id: detail.cycle,
          name: taskName,
          productName: productName,
          start: detail.releaseDate,
          end: endDate,
          progress: 0,
          color: color,
        })
      })
    } else {
      for (const version of versions) {
        if (selectedProductsSet.has(`${productName}-${version.cycle}`)) {
          const taskName = `${productName} ${version.cycle}`
          const endDate =
            typeof version.eol === 'string'
              ? version.eol
              : version.eol === false
                ? new Date(
                    new Date(version.releaseDate).setFullYear(
                      new Date(version.releaseDate).getFullYear() + 1,
                    ),
                  )
                    .toISOString()
                    .split('T')[0]
                : version.releaseDate
          tasks.push({
            id: version.cycle,
            name: taskName,
            productName: productName,
            start: version.releaseDate,
            end: endDate,
            progress: 0,
            color: color,
          })
        }
      }
    }
  }
  return tasks
}
