import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { GanttTask, ProductDetails } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertProductVersionDetailsToGanttTasks(
  allProductDetails: ProductDetails,
  selectedProductsSet: Set<string>,
): GanttTask[] {
  const tasks: GanttTask[] = []

  for (const productName in allProductDetails) {
    const versions = allProductDetails[productName]
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
          })
        }
      }
    }
  }
  return tasks
}
