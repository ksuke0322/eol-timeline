export type ProductVersionDetail = {
  cycle: string
  releaseDate: string
  eol: string | boolean
  latest?: string
  latestReleaseDate?: string
  lts?: boolean
  support?: string
  discontinued?: boolean
}

export type ProductDetails = Record<string, ProductVersionDetail[]>

export type GanttTask = {
  id: string
  name: string
  start: string
  end: string
  progress?: number
  dependencies?: string
  custom_class?: string
}
