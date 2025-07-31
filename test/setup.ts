import 'vitest-dom/extend-expect'
import { vi } from 'vitest'

// Polyfill for TextEncoder and TextDecoder for JSDOM environment
// This is often needed for libraries that use these browser APIs
// but are run in a Node.js environment like Vitest with JSDOM.
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('node:util')
  global.TextEncoder = TextEncoder
  global.TextDecoder = TextDecoder
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
