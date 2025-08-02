import 'vitest-dom/extend-expect'
import { TextEncoder, TextDecoder } from 'node:util'

// vitest-axe/matchers 用の extend 設定。
// vitest-dom っぽくいけるはずなんだけど上手くできないのでこれで通す
import { vi, expect } from 'vitest'
import * as matchers from 'vitest-axe/matchers'
expect.extend(matchers)

// Polyfill for TextEncoder and TextDecoder for JSDOM environment
// This is often needed for libraries that use these browser APIs
// but are run in a Node.js environment like Vitest with JSDOM.
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder
  global.TextDecoder = TextDecoder as typeof global.TextDecoder
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
