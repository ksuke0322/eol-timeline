import type { Plugin } from 'vite'

export function removeDataTestId(): Plugin {
  return {
    name: 'remove-data-testid',
    enforce: 'pre',
    transform(code, id) {
      if (
        process.env.NODE_ENV === 'production' &&
        (id.endsWith('.tsx') || id.endsWith('.jsx'))
      ) {
        // data-testid="..." のパターンを正規表現で検索し、空文字列に置換
        return code.replace(/\sdata-testid="[^"]*"/g, '')
      }
      return code
    },
  }
}
