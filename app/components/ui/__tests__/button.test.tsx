import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'

import { Button } from '../button'

test('基本的なボタンのa11yチェック', async () => {
  const { container } = render(<Button aria-label="Basic Button" />)
  expect(await axe(container)).toHaveNoViolations()
})

test('テキストを持つボタンのa11yチェック', async () => {
  const { container } = render(<Button>Click me</Button>)
  expect(await axe(container)).toHaveNoViolations()
})

test('無効化されたボタンのa11yチェック', async () => {
  const { container } = render(<Button disabled>Disabled Button</Button>)
  expect(await axe(container)).toHaveNoViolations()
})
