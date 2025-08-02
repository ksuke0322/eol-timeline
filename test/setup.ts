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

// Mock for HTMLCanvasElement.prototype.getContext
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  value: vi.fn(() => ({
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: [] })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => ({ data: [] })),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    fillText: vi.fn(),
    transform: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
  })),
})

// Mock for window.getComputedStyle
const mockComputedStyle = {
  getPropertyValue: vi.fn((prop) => {
    if (prop === 'length') return '0px' // Example default for length
    return '' // Default empty string for other properties
  }),
  length: 0,
  parentRule: null,
  // Add other properties as needed by axe-core or other libraries
}

Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: vi.fn(() => mockComputedStyle),
})
