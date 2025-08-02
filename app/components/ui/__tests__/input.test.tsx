import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'

import { Input } from '../input'

test('基本的な入力フィールドのa11yチェック', async () => {
  const { container } = render(<Input aria-label="Basic Input" />)
  expect(await axe(container)).toHaveNoViolations()
})

test('プレースホルダーを持つ入力フィールドのa11yチェック', async () => {
  const { container } = render(
    <Input placeholder="Enter text" aria-label="Text Input" />,
  )
  expect(await axe(container)).toHaveNoViolations()
})

test('タイプが指定された入力フィールドのa11yチェック', async () => {
  const { container } = render(<Input type="email" aria-label="Email Input" />)
  expect(await axe(container)).toHaveNoViolations()
})
