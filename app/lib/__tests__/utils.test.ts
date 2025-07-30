import { describe, it, expect } from 'vitest'

import { cn } from '~/lib/utils'

describe('cn', () => {
  it('複数の引数を結合すること', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  it('falsyな値を無視すること', () => {
    expect(cn('a', false, 'b', null, undefined, 0, 'c')).toBe('a b c')
  })

  it('オブジェクトをクラス名として扱えること', () => {
    expect(cn({ a: true, b: false, c: true })).toBe('a c')
  })

  it('配列をクラス名として扱えること', () => {
    expect(cn(['a', 'b', ['c', { d: true, e: false }]])).toBe('a b c d')
  })

  it('Tailwind CSSのマージができること', () => {
    // `px-2` が `px-4` で上書きされることを期待
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    // `text-red-500` が `text-blue-500` で上書きされることを期待
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('複雑な組み合わせでも正しく動作すること', () => {
    const isActive = true
    const hasError = false
    const className = 'extra-class'

    const result = cn(
      'base-class',
      { 'active-class': isActive, 'error-class': hasError },
      ['p-4', { 'm-2': true }],
      className,
    )

    expect(result).toBe('base-class active-class p-4 m-2 extra-class')
  })
})
