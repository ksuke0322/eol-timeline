export type ProductVersionDetail = {
  cycle: string
  releaseDate: string
  eol: string | boolean | undefined
  latest?: string
  latestReleaseDate?: string
  lts?: boolean
  support?: string
  discontinued?: boolean
}

export type ProductDetails = Record<string, ProductVersionDetail[] | null>

export type GanttTask = {
  id: string
  name: string
  productName: string
  start: string
  end: string
  progress?: number
  dependencies?: string
  custom_class?: string
  color?: string
}
