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
