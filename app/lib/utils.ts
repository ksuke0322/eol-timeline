import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { ProductVersionDetail, GanttTask } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertProductVersionDetailsToGanttTasks(
  details: ProductVersionDetail[],
): GanttTask[] {
  return details.map((detail) => {
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
    const task = {
      id: detail.cycle,
      name: detail.cycle,
      start: detail.releaseDate,
      end: endDate,
      progress: 0,
    }

    return task
  })
}
